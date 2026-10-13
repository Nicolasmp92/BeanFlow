package io.github.nicolasmp92.beanflow.comandas;

import io.github.nicolasmp92.beanflow.catalogo.Producto;
import io.github.nicolasmp92.beanflow.catalogo.ProductoRepository;
import io.github.nicolasmp92.beanflow.insumos.InventarioService;
import io.github.nicolasmp92.beanflow.mesas.Mesa;
import io.github.nicolasmp92.beanflow.mesas.MesaRepository;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Ciclo de vida de la cuenta: abrir, pedir, preparar, cobrar.
 *
 * <p>Regla de inventario del negocio: los insumos se descuentan cuando la
 * barra <em>empieza a preparar</em> (ahí se vierte la leche), no al pedir ni
 * al cobrar. Anular una línea ya en preparación no devuelve el insumo: se
 * registra como merma, porque el producto se botó.
 */
@Service
public class ComandaService {

    private static final List<String> METODOS_PAGO = List.of("efectivo", "debito", "credito", "transferencia");

    private final ComandaRepository comandas;
    private final ComandaItemRepository lineas;
    private final ProductoRepository productos;
    private final MesaRepository mesas;
    private final InventarioService inventario;

    public ComandaService(
            ComandaRepository comandas,
            ComandaItemRepository lineas,
            ProductoRepository productos,
            MesaRepository mesas,
            InventarioService inventario) {
        this.comandas = comandas;
        this.lineas = lineas;
        this.productos = productos;
        this.mesas = mesas;
        this.inventario = inventario;
    }

    /** Abre la cuenta de una mesa; {@code mesaId} nulo = pedido para llevar. */
    @Transactional
    public Comanda abrir(Long mesaId, String nota, Long usuarioId) {
        Comanda comanda = new Comanda();

        if (mesaId != null) {
            Mesa mesa = mesas.findById(mesaId)
                    .filter(Mesa::isActiva)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "La mesa no existe o está inactiva"));
            // El índice parcial de la BD también lo impide; este chequeo da el
            // mensaje legible en vez de un error de constraint.
            comandas.findByMesaIdAndEstado(mesaId, Comanda.ABIERTA).ifPresent(abierta -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "La mesa %d ya tiene una cuenta abierta".formatted(mesa.getNumero()));
            });
            comanda.setMesa(mesa);
        }

        comanda.setNota(nota);
        comanda.setAbiertaPorId(usuarioId);
        return comandas.save(comanda);
    }

    /** Agrega una línea a la cuenta. No consume insumos todavía. */
    @Transactional
    public ComandaItem agregarItem(
            Long comandaId, Long productoId, int cantidad, String nota) {
        Comanda comanda = abiertaOError(comandaId);
        if (cantidad <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor que cero");
        }

        Producto producto = productos.findById(productoId)
                .filter(Producto::isActivo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "El producto no existe o no está en la carta"));

        ComandaItem linea = new ComandaItem();
        linea.setComanda(comanda);
        linea.setProducto(producto);
        linea.setNombreProducto(producto.getNombre());
        linea.setPrecioUnitario(producto.getPrecio());
        linea.setCantidad(cantidad);
        linea.setNota(nota);
        // Lo que no pasa por barra nace listo para entregar.
        linea.setEstado(producto.isRequierePreparacion()
                ? ComandaItem.PENDIENTE
                : ComandaItem.LISTO);
        if (!producto.isRequierePreparacion()) {
            linea.setListoEn(OffsetDateTime.now());
        }

        ComandaItem guardada = lineas.save(linea);
        comanda.getItems().add(guardada);
        recalcular(comanda);
        return guardada;
    }

    /**
     * Avanza el estado de preparación. Solo acepta transiciones hacia
     * adelante: marcar "listo" algo ya entregado sería reescribir la historia.
     */
    @Transactional
    public ComandaItem cambiarEstadoItem(Long itemId, String destino, Long usuarioId) {
        ComandaItem linea = lineas.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "La línea no existe"));

        int actual = ordenEstado(linea.getEstado());
        int siguiente = ordenEstado(destino);
        if (actual < 0 || siguiente < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado no válido: " + destino);
        }
        if (siguiente <= actual) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "La línea ya está en «%s»".formatted(linea.getEstado()));
        }

        // Al entrar en preparación se consumen los insumos de la receta.
        if (linea.getEstado().equals(ComandaItem.PENDIENTE)
                && siguiente >= ordenEstado(ComandaItem.PREPARANDO)) {
            inventario.consumirReceta(
                    linea.getProducto().getId(),
                    linea.getCantidad(),
                    linea.getId(),
                    "Preparación de %s (comanda #%d)".formatted(
                            linea.getNombreProducto(), linea.getComanda().getId()),
                    usuarioId);
        }

        linea.setEstado(destino);
        if (destino.equals(ComandaItem.LISTO) && linea.getListoEn() == null) {
            linea.setListoEn(OffsetDateTime.now());
        }
        return lineas.save(linea);
    }

    /**
     * Anula una línea. Si ya se había empezado a preparar, el insumo no vuelve
     * al stock: se asienta como merma para que el costo quede visible.
     */
    @Transactional
    public Comanda anularItem(Long itemId, Long usuarioId) {
        ComandaItem linea = lineas.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "La línea no existe"));
        Comanda comanda = abiertaOError(linea.getComanda().getId());

        if (linea.getEstado().equals(ComandaItem.ANULADO)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La línea ya está anulada");
        }

        // Si ya estaba en preparación, el insumo se descontó al entrar en ese
        // estado: NO se toca el stock aquí (sería descontar dos veces) ni se
        // devuelve (el producto se botó). La salida ya asentada es la pérdida,
        // y queda enlazada a esta línea anulada por `comanda_item_id`.
        linea.setEstado(ComandaItem.ANULADO);
        lineas.save(linea);
        recalcular(comanda);
        return comanda;
    }

    /** Cierra la cuenta. Nada queda a medio preparar sin que el cajero lo sepa. */
    @Transactional
    public Comanda cobrar(Long comandaId, String metodoPago, Long usuarioId) {
        Comanda comanda = abiertaOError(comandaId);

        if (!METODOS_PAGO.contains(metodoPago)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Método de pago no válido: " + metodoPago);
        }

        List<ComandaItem> vigentes = comanda.getItems().stream()
                .filter(linea -> !linea.getEstado().equals(ComandaItem.ANULADO))
                .toList();
        if (vigentes.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "No se puede cobrar una cuenta sin consumos");
        }

        recalcular(comanda);
        comanda.setEstado(Comanda.COBRADA);
        comanda.setMetodoPago(metodoPago);
        comanda.setCobradaPorId(usuarioId);
        comanda.setCerradaEn(OffsetDateTime.now());
        return comandas.save(comanda);
    }

    /** Anula la cuenta completa (se fue el cliente, error de apertura). */
    @Transactional
    public Comanda anular(Long comandaId, Long usuarioId) {
        Comanda comanda = abiertaOError(comandaId);
        comanda.getItems().forEach(linea -> linea.setEstado(ComandaItem.ANULADO));
        comanda.setEstado(Comanda.ANULADA);
        comanda.setCobradaPorId(usuarioId);
        comanda.setCerradaEn(OffsetDateTime.now());
        comanda.setTotal(BigDecimal.ZERO);
        return comandas.save(comanda);
    }

    /** El total es derivado: se recalcula, nunca se acumula a mano. */
    private void recalcular(Comanda comanda) {
        BigDecimal total = comanda.getItems().stream()
                .filter(linea -> !linea.getEstado().equals(ComandaItem.ANULADO))
                .map(ComandaItem::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        comanda.setTotal(total);
        comandas.save(comanda);
    }

    private Comanda abiertaOError(Long comandaId) {
        Comanda comanda = comandas.findById(comandaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "La cuenta no existe"));
        if (!comanda.getEstado().equals(Comanda.ABIERTA)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "La cuenta ya está %s".formatted(comanda.getEstado()));
        }
        return comanda;
    }

    private int ordenEstado(String estado) {
        return switch (estado) {
            case ComandaItem.PENDIENTE -> 0;
            case ComandaItem.PREPARANDO -> 1;
            case ComandaItem.LISTO -> 2;
            case ComandaItem.ENTREGADO -> 3;
            default -> -1;
        };
    }
}
