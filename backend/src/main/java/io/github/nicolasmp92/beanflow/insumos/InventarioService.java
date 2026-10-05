package io.github.nicolasmp92.beanflow.insumos;

import io.github.nicolasmp92.beanflow.catalogo.RecetaItem;
import io.github.nicolasmp92.beanflow.catalogo.RecetaItemRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Única puerta que mueve stock de insumos. Nadie escribe {@code insumo.stock}
 * por fuera: así cada saldo tiene un asiento que lo explica.
 */
@Service
public class InventarioService {

    private final InsumoRepository insumos;
    private final MovimientoInsumoRepository movimientos;
    private final RecetaItemRepository recetas;

    public InventarioService(
            InsumoRepository insumos,
            MovimientoInsumoRepository movimientos,
            RecetaItemRepository recetas) {
        this.insumos = insumos;
        this.movimientos = movimientos;
        this.recetas = recetas;
    }

    /**
     * Aplica un movimiento y devuelve el asiento que lo deja registrado. El
     * signo lo decide el tipo: entrada suma; salida y merma restan; ajuste
     * fija el saldo real declarado y asienta la diferencia.
     */
    @Transactional
    public MovimientoInsumo registrar(
            Insumo insumo,
            String tipo,
            BigDecimal cantidad,
            String motivo,
            Long usuarioId,
            Long comandaItemId) {
        if (cantidad == null || cantidad.signum() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor que cero");
        }

        BigDecimal saldoPrevio = insumo.getStock();
        BigDecimal saldoNuevo = switch (tipo) {
            case MovimientoInsumo.ENTRADA -> saldoPrevio.add(cantidad);
            case MovimientoInsumo.SALIDA, MovimientoInsumo.MERMA -> saldoPrevio.subtract(cantidad);
            case MovimientoInsumo.AJUSTE -> cantidad;
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Tipo de movimiento desconocido: " + tipo);
        };

        if (saldoNuevo.signum() < 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuficiente de %s: hay %s %s"
                    .formatted(insumo.getNombre(), saldoPrevio.stripTrailingZeros().toPlainString(),
                            insumo.getUnidad()));
        }

        insumo.setStock(saldoNuevo);
        insumos.save(insumo);

        MovimientoInsumo asiento = new MovimientoInsumo();
        asiento.setInsumo(insumo);
        asiento.setTipo(tipo);
        // En un ajuste la cantidad informada es el saldo declarado; el libro
        // debe guardar lo que efectivamente se movió.
        asiento.setCantidad(tipo.equals(MovimientoInsumo.AJUSTE)
                ? saldoNuevo.subtract(saldoPrevio).abs()
                : cantidad);
        asiento.setStockResultante(saldoNuevo);
        asiento.setMotivo(motivo);
        asiento.setUsuarioId(usuarioId);
        asiento.setComandaItemId(comandaItemId);
        return movimientos.save(asiento);
    }

    /**
     * Descuenta los insumos de la receta al empezar a preparar una línea.
     * Si algún insumo no alcanza, la transacción completa se revierte: no
     * existe el estado "medio preparado".
     */
    @Transactional
    public void consumirReceta(
            Long productoId, int unidades, Long comandaItemId, String detalle, Long usuarioId) {
        List<RecetaItem> receta = recetas.findByProductoId(productoId);
        for (RecetaItem renglon : receta) {
            BigDecimal total = renglon.getCantidad().multiply(BigDecimal.valueOf(unidades));
            registrar(
                    renglon.getInsumo(),
                    MovimientoInsumo.SALIDA,
                    total,
                    detalle,
                    usuarioId,
                    comandaItemId);
        }
    }

    /**
     * Cuántas unidades del producto alcanzan los insumos actuales.
     * {@code null} = sin receta cargada, por lo tanto sin límite conocido
     * (una botella que se entrega tal cual no consume nada).
     */
    public Integer disponibles(List<RecetaItem> receta) {
        if (receta.isEmpty()) return null;

        int minimo = Integer.MAX_VALUE;
        for (RecetaItem renglon : receta) {
            BigDecimal stock = renglon.getInsumo().getStock();
            int alcanza = stock.divide(renglon.getCantidad(), 0, RoundingMode.DOWN).intValue();
            minimo = Math.min(minimo, alcanza);
        }
        return minimo;
    }
}
