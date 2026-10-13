package io.github.nicolasmp92.beanflow.comandas;

import io.github.nicolasmp92.beanflow.usuarios.UsuarioActual;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Tablero de la barra: lo que falta preparar, en orden de llegada. Es la
 * pantalla que mira el barista, por eso devuelve solo lo accionable.
 */
@RestController
@RequestMapping("/api/cocina")
public class CocinaController {

    private final ComandaItemRepository lineas;
    private final ComandaService servicio;
    private final UsuarioActual usuarioActual;

    public CocinaController(
            ComandaItemRepository lineas, ComandaService servicio, UsuarioActual usuarioActual) {
        this.lineas = lineas;
        this.servicio = servicio;
        this.usuarioActual = usuarioActual;
    }

    public record EstadoRequest(@NotBlank String estado) {
    }

    public record LineaCocina(
            Long id,
            Long comandaId,
            Integer mesaNumero,
            String nombreProducto,
            Integer cantidad,
            String estado,
            String nota,
            OffsetDateTime creadoEn) {
    }

    /** Pendientes y en preparación: la cola real de trabajo. */
    @GetMapping("/pendientes")
    public List<LineaCocina> pendientes() {
        return lineas
                .findByEstadoInOrderByCreadoEnAsc(
                        List.of(ComandaItem.PENDIENTE, ComandaItem.PREPARANDO))
                .stream()
                .map(linea -> new LineaCocina(
                        linea.getId(),
                        linea.getComanda().getId(),
                        linea.getComanda().getMesa() == null
                                ? null
                                : linea.getComanda().getMesa().getNumero(),
                        linea.getNombreProducto(),
                        linea.getCantidad(),
                        linea.getEstado(),
                        linea.getNota(),
                        linea.getCreadoEn()))
                .toList();
    }

    /** Avanza la línea. Al pasar a «preparando» se descuentan los insumos. */
    @PatchMapping("/items/{itemId}")
    public LineaCocina cambiarEstado(
            @PathVariable Long itemId,
            @Valid @RequestBody EstadoRequest peticion,
            @AuthenticationPrincipal String correo) {
        ComandaItem linea = servicio.cambiarEstadoItem(
                itemId, peticion.estado(), usuarioActual.idDe(correo));
        return new LineaCocina(
                linea.getId(),
                linea.getComanda().getId(),
                linea.getComanda().getMesa() == null
                        ? null
                        : linea.getComanda().getMesa().getNumero(),
                linea.getNombreProducto(),
                linea.getCantidad(),
                linea.getEstado(),
                linea.getNota(),
                linea.getCreadoEn());
    }
}
