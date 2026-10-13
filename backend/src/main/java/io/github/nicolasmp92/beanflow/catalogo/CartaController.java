package io.github.nicolasmp92.beanflow.catalogo;

import io.github.nicolasmp92.beanflow.insumos.InventarioService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * La carta tal como la ve el garzón: categorías con sus productos y cuántas
 * unidades alcanzan los insumos. {@code disponibles} nulo = sin receta, por lo
 * tanto sin límite de inventario.
 */
@RestController
@RequestMapping("/api/carta")
public class CartaController {

    private final CategoriaRepository categorias;
    private final ProductoRepository productos;
    private final RecetaItemRepository recetas;
    private final InventarioService inventario;

    public CartaController(
            CategoriaRepository categorias,
            ProductoRepository productos,
            RecetaItemRepository recetas,
            InventarioService inventario) {
        this.categorias = categorias;
        this.productos = productos;
        this.recetas = recetas;
        this.inventario = inventario;
    }

    public record ProductoCarta(
            Long id,
            String nombre,
            String descripcion,
            BigDecimal precio,
            boolean requierePreparacion,
            Integer disponibles) {
    }

    public record CategoriaCarta(Long id, String nombre, List<ProductoCarta> productos) {
    }

    @GetMapping
    public List<CategoriaCarta> carta() {
        List<Producto> activos = productos.findByActivoTrueOrderByNombreAsc();

        // Una sola consulta de recetas para todos los productos: así la carta
        // no dispara N+1 al calcular disponibilidad.
        Map<Long, List<RecetaItem>> porProducto = activos.isEmpty()
                ? Map.of()
                : recetas.findByProductoIdIn(activos.stream().map(Producto::getId).toList())
                        .stream()
                        .collect(Collectors.groupingBy(renglon -> renglon.getProducto().getId()));

        Map<Long, List<ProductoCarta>> agrupados = new java.util.LinkedHashMap<>();
        for (Producto producto : activos) {
            List<RecetaItem> receta = porProducto.getOrDefault(producto.getId(), List.of());
            agrupados
                    .computeIfAbsent(producto.getCategoria().getId(), k -> new ArrayList<>())
                    .add(new ProductoCarta(
                            producto.getId(),
                            producto.getNombre(),
                            producto.getDescripcion(),
                            producto.getPrecio(),
                            producto.isRequierePreparacion(),
                            inventario.disponibles(receta)));
        }

        return categorias.findByActivoTrueOrderByNombreAsc().stream()
                .map(categoria -> new CategoriaCarta(
                        categoria.getId(),
                        categoria.getNombre(),
                        agrupados.getOrDefault(categoria.getId(), List.of())))
                .filter(categoria -> !categoria.productos().isEmpty())
                .toList();
    }
}
