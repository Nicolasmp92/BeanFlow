package io.github.nicolasmp92.beanflow.insumos;

import io.github.nicolasmp92.beanflow.catalogo.RecetaItemRepository;
import io.github.nicolasmp92.beanflow.usuarios.UsuarioActual;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Bodega: insumos, recepciones, ajustes y libro de movimientos (solo admin). */
@RestController
@RequestMapping("/api/admin/inventario")
public class AdminInventarioController {

    private static final int TOPE_LIBRO = 100;

    private final InsumoRepository insumos;
    private final MovimientoInsumoRepository movimientos;
    private final RecetaItemRepository recetas;
    private final InventarioService inventario;
    private final UsuarioActual usuarioActual;

    public AdminInventarioController(
            InsumoRepository insumos,
            MovimientoInsumoRepository movimientos,
            RecetaItemRepository recetas,
            InventarioService inventario,
            UsuarioActual usuarioActual) {
        this.insumos = insumos;
        this.movimientos = movimientos;
        this.recetas = recetas;
        this.inventario = inventario;
        this.usuarioActual = usuarioActual;
    }

    public record InsumoRequest(
            @NotBlank String nombre,
            @NotBlank @Pattern(regexp = "g|ml|unidad", message = "debe ser g, ml o unidad") String unidad,
            @NotNull @DecimalMin("0") BigDecimal stockMinimo,
            @NotNull @DecimalMin("0") BigDecimal costoUnitario) {
    }

    public record MovimientoRequest(
            @NotNull Long insumoId,
            @NotBlank @Pattern(regexp = "entrada|merma|ajuste") String tipo,
            @NotNull @DecimalMin(value = "0", inclusive = true) BigDecimal cantidad,
            String motivo) {
    }

    public record InsumoResponse(
            Long id,
            String nombre,
            String unidad,
            BigDecimal stock,
            BigDecimal stockMinimo,
            BigDecimal costoUnitario,
            boolean activo,
            boolean bajoMinimo) {
    }

    public record MovimientoResponse(
            Long id,
            String insumo,
            String unidad,
            String tipo,
            BigDecimal cantidad,
            BigDecimal stockResultante,
            String motivo,
            OffsetDateTime creadoEn) {
    }

    @GetMapping("/insumos")
    public List<InsumoResponse> listar() {
        return insumos.findAllByOrderByNombreAsc().stream()
                .map(AdminInventarioController::aResponse)
                .toList();
    }

    @PostMapping("/insumos")
    @ResponseStatus(HttpStatus.CREATED)
    public InsumoResponse crear(@Valid @RequestBody InsumoRequest peticion) {
        Insumo insumo = new Insumo();
        aplicar(insumo, peticion);
        return aResponse(insumos.save(insumo));
    }

    @PutMapping("/insumos/{id}")
    public InsumoResponse actualizar(
            @PathVariable Long id, @Valid @RequestBody InsumoRequest peticion) {
        Insumo insumo = buscar(id);
        aplicar(insumo, peticion);
        return aResponse(insumos.save(insumo));
    }

    /**
     * Desactiva en vez de borrar: un insumo con historial en el libro no puede
     * desaparecer sin romper la trazabilidad de lo ya preparado.
     */
    @PostMapping("/insumos/{id}/alternar")
    public InsumoResponse alternarEstado(@PathVariable Long id) {
        Insumo insumo = buscar(id);
        if (insumo.isActivo() && recetas.existsByInsumoId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "El insumo está en uso por alguna receta; quítalo de la receta primero");
        }
        insumo.setActivo(!insumo.isActivo());
        return aResponse(insumos.save(insumo));
    }

    /** Recepción de mercadería, merma o ajuste de saldo real. */
    @PostMapping("/movimientos")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<MovimientoResponse> registrar(
            @Valid @RequestBody MovimientoRequest peticion,
            @AuthenticationPrincipal String correo) {
        Insumo insumo = buscar(peticion.insumoId());
        MovimientoInsumo asiento = inventario.registrar(
                insumo,
                peticion.tipo(),
                peticion.cantidad(),
                peticion.motivo(),
                usuarioActual.idDe(correo),
                null);
        return ResponseEntity.status(HttpStatus.CREATED).body(aResponse(asiento));
    }

    @GetMapping("/movimientos")
    public List<MovimientoResponse> libro() {
        return movimientos.findAllByOrderByCreadoEnDesc(PageRequest.of(0, TOPE_LIBRO)).stream()
                .map(AdminInventarioController::aResponse)
                .toList();
    }

    private Insumo buscar(Long id) {
        return insumos.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "El insumo no existe"));
    }

    private void aplicar(Insumo insumo, InsumoRequest peticion) {
        insumo.setNombre(peticion.nombre().trim());
        insumo.setUnidad(peticion.unidad());
        insumo.setStockMinimo(peticion.stockMinimo());
        insumo.setCostoUnitario(peticion.costoUnitario());
    }

    private static InsumoResponse aResponse(Insumo insumo) {
        return new InsumoResponse(
                insumo.getId(),
                insumo.getNombre(),
                insumo.getUnidad(),
                insumo.getStock(),
                insumo.getStockMinimo(),
                insumo.getCostoUnitario(),
                insumo.isActivo(),
                insumo.getStock().compareTo(insumo.getStockMinimo()) <= 0);
    }

    private static MovimientoResponse aResponse(MovimientoInsumo movimiento) {
        return new MovimientoResponse(
                movimiento.getId(),
                movimiento.getInsumo().getNombre(),
                movimiento.getInsumo().getUnidad(),
                movimiento.getTipo(),
                movimiento.getCantidad(),
                movimiento.getStockResultante(),
                movimiento.getMotivo(),
                movimiento.getCreadoEn());
    }
}
