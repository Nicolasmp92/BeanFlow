package io.github.nicolasmp92.beanflow.seed;

import io.github.nicolasmp92.beanflow.catalogo.Categoria;
import io.github.nicolasmp92.beanflow.catalogo.CategoriaRepository;
import io.github.nicolasmp92.beanflow.catalogo.Producto;
import io.github.nicolasmp92.beanflow.catalogo.ProductoRepository;
import io.github.nicolasmp92.beanflow.catalogo.RecetaItem;
import io.github.nicolasmp92.beanflow.catalogo.RecetaItemRepository;
import io.github.nicolasmp92.beanflow.insumos.Insumo;
import io.github.nicolasmp92.beanflow.insumos.InsumoRepository;
import io.github.nicolasmp92.beanflow.insumos.InventarioService;
import io.github.nicolasmp92.beanflow.insumos.MovimientoInsumo;
import io.github.nicolasmp92.beanflow.mesas.Mesa;
import io.github.nicolasmp92.beanflow.mesas.MesaRepository;
import io.github.nicolasmp92.beanflow.usuarios.Usuario;
import io.github.nicolasmp92.beanflow.usuarios.UsuarioRepository;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Carga inicial de una cafetería operable: administrador, mesas, bodega con
 * stock inicial y una carta con recetas reales. El stock entra por el libro,
 * no por un UPDATE: así el saldo inicial también es auditable.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarios;
    private final CategoriaRepository categorias;
    private final ProductoRepository productos;
    private final RecetaItemRepository recetas;
    private final InsumoRepository insumos;
    private final MesaRepository mesas;
    private final InventarioService inventario;
    private final PasswordEncoder encoder;
    private final String seedCorreo;
    private final String seedClave;

    public DataSeeder(
            UsuarioRepository usuarios,
            CategoriaRepository categorias,
            ProductoRepository productos,
            RecetaItemRepository recetas,
            InsumoRepository insumos,
            MesaRepository mesas,
            InventarioService inventario,
            PasswordEncoder encoder,
            @Value("${beanflow.seed.correo}") String seedCorreo,
            @Value("${beanflow.seed.clave}") String seedClave) {
        this.usuarios = usuarios;
        this.categorias = categorias;
        this.productos = productos;
        this.recetas = recetas;
        this.insumos = insumos;
        this.mesas = mesas;
        this.inventario = inventario;
        this.encoder = encoder;
        this.seedCorreo = seedCorreo;
        this.seedClave = seedClave;
    }

    @Override
    public void run(String... args) {
        if (usuarios.count() == 0) {
            usuarios.save(new Usuario(
                    seedCorreo, "Administrador", encoder.encode(seedClave), "admin"));
        }
        if (mesas.count() == 0) {
            for (int numero = 1; numero <= 8; numero++) {
                mesas.save(new Mesa(numero, null));
            }
        }
        // Si ya hay carta, no se vuelve a sembrar: el seeder no pisa datos reales.
        if (productos.count() > 0) return;

        Map<String, Insumo> bodega = sembrarInsumos();
        sembrarCarta(bodega);
    }

    private Map<String, Insumo> sembrarInsumos() {
        Map<String, Insumo> creados = new LinkedHashMap<>();
        // nombre, unidad, stock inicial, mínimo, costo por unidad de medida
        Object[][] base = {
            {"Café en grano", "g", "5000", "1000", "12"},
            {"Leche entera", "ml", "20000", "5000", "1.2"},
            {"Agua", "ml", "30000", "5000", "0.1"},
            {"Azúcar", "g", "3000", "500", "1.5"},
            {"Cacao en polvo", "g", "1200", "300", "9"},
            {"Vaso 12 oz", "unidad", "200", "50", "90"},
            {"Harina", "g", "6000", "1500", "1.1"},
            {"Pan de molde", "unidad", "80", "20", "180"},
            {"Jamón", "g", "2500", "600", "14"},
            {"Queso", "g", "2500", "600", "16"},
        };

        for (Object[] fila : base) {
            Insumo insumo = new Insumo();
            insumo.setNombre((String) fila[0]);
            insumo.setUnidad((String) fila[1]);
            insumo.setStockMinimo(new BigDecimal((String) fila[3]));
            insumo.setCostoUnitario(new BigDecimal((String) fila[4]));
            Insumo guardado = insumos.save(insumo);
            inventario.registrar(
                    guardado,
                    MovimientoInsumo.ENTRADA,
                    new BigDecimal((String) fila[2]),
                    "Carga inicial de bodega",
                    null,
                    null);
            creados.put(guardado.getNombre(), guardado);
        }
        return creados;
    }

    private void sembrarCarta(Map<String, Insumo> bodega) {
        Categoria cafes = categorias.save(new Categoria("Cafés"));
        Categoria pasteleria = categorias.save(new Categoria("Pastelería"));
        Categoria sandwiches = categorias.save(new Categoria("Sándwiches"));

        crear(bodega, cafes, "Espresso", "Doble carga, 30 ml", "2200", true,
                Map.of("Café en grano", "18", "Vaso 12 oz", "1"));
        crear(bodega, cafes, "Americano", "Espresso alargado con agua caliente", "2500", true,
                Map.of("Café en grano", "18", "Agua", "180", "Vaso 12 oz", "1"));
        crear(bodega, cafes, "Capuchino", "Espresso con leche vaporizada y cacao", "3500", true,
                Map.of("Café en grano", "18", "Leche entera", "150",
                        "Cacao en polvo", "3", "Vaso 12 oz", "1"));
        crear(bodega, cafes, "Latte", "Espresso con abundante leche", "3700", true,
                Map.of("Café en grano", "18", "Leche entera", "220", "Vaso 12 oz", "1"));
        crear(bodega, pasteleria, "Queque de vainilla", "Porción casera", "2800", false,
                Map.of("Harina", "80", "Azúcar", "40"));
        crear(bodega, sandwiches, "Sándwich jamón queso", "Pan de molde tostado", "4200", true,
                Map.of("Pan de molde", "2", "Jamón", "60", "Queso", "50"));
    }

    private void crear(
            Map<String, Insumo> bodega,
            Categoria categoria,
            String nombre,
            String descripcion,
            String precio,
            boolean requierePreparacion,
            Map<String, String> receta) {
        Producto producto = new Producto();
        producto.setCategoria(categoria);
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(new BigDecimal(precio));
        producto.setRequierePreparacion(requierePreparacion);
        Producto guardado = productos.save(producto);

        receta.forEach((nombreInsumo, cantidad) -> {
            Insumo insumo = bodega.get(nombreInsumo);
            if (insumo == null) return;
            recetas.save(new RecetaItem(guardado, insumo, new BigDecimal(cantidad)));
        });
    }
}
