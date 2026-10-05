package io.github.nicolasmp92.beanflow.insumos;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import io.github.nicolasmp92.beanflow.catalogo.Producto;
import io.github.nicolasmp92.beanflow.catalogo.RecetaItem;
import io.github.nicolasmp92.beanflow.catalogo.RecetaItemRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

/**
 * Reglas de inventario sin BD: el saldo nunca queda negativo, el ajuste fija
 * el saldo declarado y la disponibilidad de un producto es la del insumo que
 * primero se agota.
 */
class InventarioServiceTest {

    private InsumoRepository insumos;
    private MovimientoInsumoRepository movimientos;
    private RecetaItemRepository recetas;
    private InventarioService servicio;

    @BeforeEach
    void preparar() {
        insumos = mock(InsumoRepository.class);
        movimientos = mock(MovimientoInsumoRepository.class);
        recetas = mock(RecetaItemRepository.class);
        servicio = new InventarioService(insumos, movimientos, recetas);

        when(insumos.save(any(Insumo.class))).thenAnswer(llamada -> llamada.getArgument(0));
        when(movimientos.save(any(MovimientoInsumo.class)))
                .thenAnswer(llamada -> llamada.getArgument(0));
    }

    private Insumo insumo(String nombre, String unidad, String stock) {
        Insumo insumo = new Insumo();
        insumo.setNombre(nombre);
        insumo.setUnidad(unidad);
        insumo.setStock(new BigDecimal(stock));
        return insumo;
    }

    @Test
    void laEntradaSumaYDejaAsiento() {
        Insumo leche = insumo("Leche entera", "ml", "1000");

        MovimientoInsumo asiento = servicio.registrar(
                leche, MovimientoInsumo.ENTRADA, new BigDecimal("500"), "Factura 1", null, null);

        assertEquals(new BigDecimal("1500"), leche.getStock());
        assertEquals(new BigDecimal("1500"), asiento.getStockResultante());
        assertEquals(MovimientoInsumo.ENTRADA, asiento.getTipo());
    }

    @Test
    void laSalidaRestaElConsumo() {
        Insumo cafe = insumo("Café en grano", "g", "100");

        servicio.registrar(cafe, MovimientoInsumo.SALIDA, new BigDecimal("18"), null, null, null);

        assertEquals(new BigDecimal("82"), cafe.getStock());
    }

    @Test
    void rechazaDejarElStockNegativo() {
        Insumo cafe = insumo("Café en grano", "g", "10");

        ResponseStatusException error = assertThrows(ResponseStatusException.class, () ->
                servicio.registrar(
                        cafe, MovimientoInsumo.SALIDA, new BigDecimal("18"), null, null, null));

        // El saldo no se toca si el movimiento no es válido.
        assertEquals(new BigDecimal("10"), cafe.getStock());
        assertEquals(409, error.getStatusCode().value());
    }

    @Test
    void rechazaCantidadNoPositiva() {
        Insumo cafe = insumo("Café en grano", "g", "10");

        assertThrows(ResponseStatusException.class, () ->
                servicio.registrar(cafe, MovimientoInsumo.ENTRADA, BigDecimal.ZERO, null, null, null));
    }

    @Test
    void elAjusteFijaElSaldoRealYAsientaLaDiferencia() {
        Insumo azucar = insumo("Azúcar", "g", "500");

        // El inventario físico contó 420 g: el saldo queda en 420 y el libro
        // registra los 80 g de diferencia, no los 420 declarados.
        MovimientoInsumo asiento = servicio.registrar(
                azucar, MovimientoInsumo.AJUSTE, new BigDecimal("420"), "Conteo", null, null);

        assertEquals(new BigDecimal("420"), azucar.getStock());
        assertEquals(new BigDecimal("80"), asiento.getCantidad());
        assertEquals(new BigDecimal("420"), asiento.getStockResultante());
    }

    @Test
    void laDisponibilidadLaDecideElInsumoQueSeAgotaPrimero() {
        Producto capuchino = new Producto();
        // Alcanza para 5 cafés (90/18) pero solo 2 leches (300/150).
        List<RecetaItem> receta = List.of(
                new RecetaItem(capuchino, insumo("Café en grano", "g", "90"), new BigDecimal("18")),
                new RecetaItem(capuchino, insumo("Leche entera", "ml", "300"), new BigDecimal("150")));

        assertEquals(2, servicio.disponibles(receta));
    }

    @Test
    void sinRecetaNoHayLimiteConocido() {
        // Una botella que se entrega tal cual no consume insumos: su
        // disponibilidad no la gobierna el inventario.
        assertNull(servicio.disponibles(List.of()));
    }

    @Test
    void consumirRecetaDescuentaPorUnidadPedida() {
        Producto latte = new Producto();
        Insumo cafe = insumo("Café en grano", "g", "100");
        Insumo leche = insumo("Leche entera", "ml", "1000");
        when(recetas.findByProductoId(7L)).thenReturn(List.of(
                new RecetaItem(latte, cafe, new BigDecimal("18")),
                new RecetaItem(latte, leche, new BigDecimal("220"))));

        servicio.consumirReceta(7L, 2, 55L, "Preparación", 1L);

        assertEquals(new BigDecimal("64"), cafe.getStock());
        assertEquals(new BigDecimal("560"), leche.getStock());
    }
}
