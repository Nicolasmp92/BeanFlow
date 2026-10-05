package io.github.nicolasmp92.beanflow.mesas;

import io.github.nicolasmp92.beanflow.comandas.Comanda;
import io.github.nicolasmp92.beanflow.comandas.ComandaRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Plano del salón. El estado ocupada/libre no se almacena: se deriva de la
 * comanda abierta, que es la única fuente de verdad.
 */
@RestController
@RequestMapping("/api/mesas")
public class MesasController {

    private final MesaRepository mesas;
    private final ComandaRepository comandas;

    public MesasController(MesaRepository mesas, ComandaRepository comandas) {
        this.mesas = mesas;
        this.comandas = comandas;
    }

    public record MesaSalon(
            Long id,
            Integer numero,
            String nombre,
            Long comandaId,
            BigDecimal total,
            Integer itemsPendientes) {
    }

    @GetMapping
    public List<MesaSalon> salon() {
        Map<Long, Comanda> abiertasPorMesa =
                comandas.findByEstadoOrderByAbiertaEnAsc(Comanda.ABIERTA).stream()
                        .filter(comanda -> comanda.getMesa() != null)
                        .collect(Collectors.toMap(
                                comanda -> comanda.getMesa().getId(), Function.identity()));

        return mesas.findByActivaTrueOrderByNumeroAsc().stream()
                .map(mesa -> {
                    Comanda abierta = abiertasPorMesa.get(mesa.getId());
                    if (abierta == null) {
                        return new MesaSalon(
                                mesa.getId(), mesa.getNumero(), mesa.getNombre(), null, null, null);
                    }
                    int pendientes = (int) abierta.getItems().stream()
                            .filter(linea -> linea.getEstado().equals("pendiente")
                                    || linea.getEstado().equals("preparando"))
                            .count();
                    return new MesaSalon(
                            mesa.getId(),
                            mesa.getNumero(),
                            mesa.getNombre(),
                            abierta.getId(),
                            abierta.getTotal(),
                            pendientes);
                })
                .toList();
    }
}
