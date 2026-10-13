package io.github.nicolasmp92.beanflow.comandas;

import io.github.nicolasmp92.beanflow.usuarios.UsuarioActual;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Cuentas del salón: abrir, pedir, cobrar y consultar el historial del día. */
@RestController
@RequestMapping("/api/comandas")
public class ComandasController {

    private static final int TOPE_HISTORIAL = 100;

    private final ComandaRepository comandas;
    private final ComandaService servicio;
    private final UsuarioActual usuarioActual;

    public ComandasController(
            ComandaRepository comandas, ComandaService servicio, UsuarioActual usuarioActual) {
        this.comandas = comandas;
        this.servicio = servicio;
        this.usuarioActual = usuarioActual;
    }

    public record AbrirRequest(Long mesaId, String nota) {
    }

    public record AgregarItemRequest(
            @NotNull Long productoId,
            @NotNull @Min(1) Integer cantidad,
            String nota) {
    }

    public record CobrarRequest(@NotBlank String metodoPago) {
    }

    public record ItemResponse(
            Long id,
            Long productoId,
            String nombreProducto,
            BigDecimal precioUnitario,
            Integer cantidad,
            BigDecimal subtotal,
            String estado,
            String nota,
            OffsetDateTime creadoEn) {
    }

    public record ComandaResponse(
            Long id,
            Long mesaId,
            Integer mesaNumero,
            String estado,
            BigDecimal total,
            String metodoPago,
            String nota,
            OffsetDateTime abiertaEn,
            OffsetDateTime cerradaEn,
            List<ItemResponse> items) {
    }

    @GetMapping
    public List<ComandaResponse> abiertas() {
        return comandas.findByEstadoOrderByAbiertaEnAsc(Comanda.ABIERTA).stream()
                .map(ComandasController::aResponse)
                .toList();
    }

    @GetMapping("/historial")
    public List<ComandaResponse> historial() {
        return comandas.findAllByOrderByIdDesc(PageRequest.of(0, TOPE_HISTORIAL)).stream()
                .filter(comanda -> !comanda.getEstado().equals(Comanda.ABIERTA))
                .map(ComandasController::aResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ComandaResponse detalle(@PathVariable Long id) {
        return comandas.findById(id)
                .map(ComandasController::aResponse)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "La cuenta no existe"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComandaResponse abrir(
            @Valid @RequestBody AbrirRequest peticion,
            @AuthenticationPrincipal String correo) {
        Comanda comanda = servicio.abrir(
                peticion.mesaId(), peticion.nota(), usuarioActual.idDe(correo));
        return aResponse(comanda);
    }

    @PostMapping("/{id}/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ComandaResponse agregarItem(
            @PathVariable Long id, @Valid @RequestBody AgregarItemRequest peticion) {
        servicio.agregarItem(id, peticion.productoId(), peticion.cantidad(), peticion.nota());
        return detalle(id);
    }

    @DeleteMapping("/items/{itemId}")
    public ComandaResponse anularItem(
            @PathVariable Long itemId, @AuthenticationPrincipal String correo) {
        return aResponse(servicio.anularItem(itemId, usuarioActual.idDe(correo)));
    }

    @PostMapping("/{id}/cobrar")
    public ComandaResponse cobrar(
            @PathVariable Long id,
            @Valid @RequestBody CobrarRequest peticion,
            @AuthenticationPrincipal String correo) {
        return aResponse(servicio.cobrar(id, peticion.metodoPago(), usuarioActual.idDe(correo)));
    }

    @PostMapping("/{id}/anular")
    public ComandaResponse anular(
            @PathVariable Long id, @AuthenticationPrincipal String correo) {
        return aResponse(servicio.anular(id, usuarioActual.idDe(correo)));
    }

    static ComandaResponse aResponse(Comanda comanda) {
        List<ItemResponse> items = comanda.getItems().stream()
                .map(linea -> new ItemResponse(
                        linea.getId(),
                        linea.getProducto().getId(),
                        linea.getNombreProducto(),
                        linea.getPrecioUnitario(),
                        linea.getCantidad(),
                        linea.subtotal(),
                        linea.getEstado(),
                        linea.getNota(),
                        linea.getCreadoEn()))
                .toList();

        return new ComandaResponse(
                comanda.getId(),
                comanda.getMesa() == null ? null : comanda.getMesa().getId(),
                comanda.getMesa() == null ? null : comanda.getMesa().getNumero(),
                comanda.getEstado(),
                comanda.getTotal(),
                comanda.getMetodoPago(),
                comanda.getNota(),
                comanda.getAbiertaEn(),
                comanda.getCerradaEn(),
                items);
    }
}
