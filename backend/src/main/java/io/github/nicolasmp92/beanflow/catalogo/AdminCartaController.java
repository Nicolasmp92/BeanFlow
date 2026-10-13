package io.github.nicolasmp92.beanflow.catalogo;

import io.github.nicolasmp92.beanflow.insumos.Insumo;
import io.github.nicolasmp92.beanflow.insumos.InsumoRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Mantención de la carta: categorías, productos y su receta (solo admin). */
@RestController
@RequestMapping("/api/admin/carta")
public class AdminCartaController {

    private final CategoriaRepository categorias;
    private final ProductoRepository productos;
    private final RecetaItemRepository recetas;
    private final InsumoRepository insumos;

    public AdminCartaController(
            CategoriaRepository categorias,
            ProductoRepository productos,
            RecetaItemRepository recetas,
            InsumoRepository insumos) {
        this.categorias = categorias;
        this.productos = productos;
        this.recetas = recetas;
        this.insumos = insumos;
    }

    public record CategoriaRequest(@NotBlank String nombre) {
    }

    public record ProductoRequest(
            @NotNull Long categoriaId,
            @NotBlank String nombre,
            String descripcion,
            @NotNull @DecimalMin("0") BigDecimal precio,
            boolean requierePreparacion) {
    }

    public record RenglonRequest(
            @NotNull Long insumoId,
            @NotNull @DecimalMin(value = "0", inclusive = false) BigDecimal cantidad) {
    }

    public record CategoriaResponse(Long id, String nombre, boolean activo) {
    }

    public record ProductoResponse(
            Long id,
            Long categoriaId,
            String categoriaNombre,
            String nombre,
            String descripcion,
            BigDecimal precio,
            boolean requierePreparacion,
            boolean activo) {
    }

    public record RenglonResponse(
            Long id, Long insumoId, String insumoNombre, String unidad, BigDecimal cantidad) {
    }

    // --- Categorías ---

    @GetMapping("/categorias")
    public List<CategoriaResponse> listarCategorias() {
        return categorias.findAllByOrderByNombreAsc().stream()
                .map(categoria -> new CategoriaResponse(
                        categoria.getId(), categoria.getNombre(), categoria.isActivo()))
                .toList();
    }

    @PostMapping("/categorias")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaResponse crearCategoria(@Valid @RequestBody CategoriaRequest peticion) {
        Categoria categoria = categorias.save(new Categoria(peticion.nombre().trim()));
        return new CategoriaResponse(categoria.getId(), categoria.getNombre(), categoria.isActivo());
    }

    @PutMapping("/categorias/{id}")
    public CategoriaResponse actualizarCategoria(
            @PathVariable Long id, @Valid @RequestBody CategoriaRequest peticion) {
        Categoria categoria = categorias.findById(id).orElseThrow(this::noExiste);
        categoria.setNombre(peticion.nombre().trim());
        categorias.save(categoria);
        return new CategoriaResponse(categoria.getId(), categoria.getNombre(), categoria.isActivo());
    }

    @PostMapping("/categorias/{id}/alternar")
    public CategoriaResponse alternarCategoria(@PathVariable Long id) {
        Categoria categoria = categorias.findById(id).orElseThrow(this::noExiste);
        if (categoria.isActivo() && productos.existsByCategoriaIdAndActivoTrue(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "La categoría tiene productos activos; desactívalos primero");
        }
        categoria.setActivo(!categoria.isActivo());
        categorias.save(categoria);
        return new CategoriaResponse(categoria.getId(), categoria.getNombre(), categoria.isActivo());
    }

    // --- Productos ---

    @GetMapping("/productos")
    public List<ProductoResponse> listarProductos() {
        return productos.findAllByOrderByNombreAsc().stream()
                .map(AdminCartaController::aResponse)
                .toList();
    }

    @PostMapping("/productos")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoResponse crearProducto(@Valid @RequestBody ProductoRequest peticion) {
        Producto producto = new Producto();
        aplicar(producto, peticion);
        return aResponse(productos.save(producto));
    }

    @PutMapping("/productos/{id}")
    public ProductoResponse actualizarProducto(
            @PathVariable Long id, @Valid @RequestBody ProductoRequest peticion) {
        Producto producto = productos.findById(id).orElseThrow(this::noExiste);
        aplicar(producto, peticion);
        return aResponse(productos.save(producto));
    }

    @PostMapping("/productos/{id}/alternar")
    public ProductoResponse alternarProducto(@PathVariable Long id) {
        Producto producto = productos.findById(id).orElseThrow(this::noExiste);
        producto.setActivo(!producto.isActivo());
        return aResponse(productos.save(producto));
    }

    // --- Receta de un producto ---

    @GetMapping("/productos/{id}/receta")
    public List<RenglonResponse> receta(@PathVariable Long id) {
        return recetas.findByProductoId(id).stream()
                .map(renglon -> new RenglonResponse(
                        renglon.getId(),
                        renglon.getInsumo().getId(),
                        renglon.getInsumo().getNombre(),
                        renglon.getInsumo().getUnidad(),
                        renglon.getCantidad()))
                .toList();
    }

    @PostMapping("/productos/{id}/receta")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public List<RenglonResponse> agregarRenglon(
            @PathVariable Long id, @Valid @RequestBody RenglonRequest peticion) {
        Producto producto = productos.findById(id).orElseThrow(this::noExiste);
        Insumo insumo = insumos.findById(peticion.insumoId())
                .filter(Insumo::isActivo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "El insumo no existe o está inactivo"));

        // Mismo insumo dos veces en una receta = cantidad ambigua; se actualiza.
        recetas.findByProductoId(id).stream()
                .filter(renglon -> renglon.getInsumo().getId().equals(insumo.getId()))
                .findFirst()
                .ifPresentOrElse(
                        renglon -> {
                            renglon.setCantidad(peticion.cantidad());
                            recetas.save(renglon);
                        },
                        () -> recetas.save(new RecetaItem(producto, insumo, peticion.cantidad())));

        return receta(id);
    }

    @DeleteMapping("/receta/{renglonId}")
    public void quitarRenglon(@PathVariable Long renglonId) {
        if (!recetas.existsById(renglonId)) throw noExiste();
        recetas.deleteById(renglonId);
    }

    private void aplicar(Producto producto, ProductoRequest peticion) {
        Categoria categoria = categorias.findById(peticion.categoriaId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "La categoría no existe"));
        producto.setCategoria(categoria);
        producto.setNombre(peticion.nombre().trim());
        producto.setDescripcion(peticion.descripcion());
        producto.setPrecio(peticion.precio());
        producto.setRequierePreparacion(peticion.requierePreparacion());
    }

    private static ProductoResponse aResponse(Producto producto) {
        return new ProductoResponse(
                producto.getId(),
                producto.getCategoria().getId(),
                producto.getCategoria().getNombre(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.isRequierePreparacion(),
                producto.isActivo());
    }

    private ResponseStatusException noExiste() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "El registro no existe");
    }
}
