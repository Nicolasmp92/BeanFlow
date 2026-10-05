package io.github.nicolasmp92.beanflow.mesas;

import io.github.nicolasmp92.beanflow.comandas.Comanda;
import io.github.nicolasmp92.beanflow.comandas.ComandaRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Alta y baja de mesas del salón (solo admin). */
@RestController
@RequestMapping("/api/admin/mesas")
public class AdminMesasController {

    private final MesaRepository mesas;
    private final ComandaRepository comandas;

    public AdminMesasController(MesaRepository mesas, ComandaRepository comandas) {
        this.mesas = mesas;
        this.comandas = comandas;
    }

    public record MesaRequest(@NotNull @Min(1) Integer numero, String nombre) {
    }

    public record MesaResponse(Long id, Integer numero, String nombre, boolean activa) {
    }

    @GetMapping
    public List<MesaResponse> listar() {
        return mesas.findAllByOrderByNumeroAsc().stream()
                .map(mesa -> new MesaResponse(
                        mesa.getId(), mesa.getNumero(), mesa.getNombre(), mesa.isActiva()))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MesaResponse crear(@Valid @RequestBody MesaRequest peticion) {
        if (mesas.existsByNumero(peticion.numero())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe la mesa " + peticion.numero());
        }
        Mesa mesa = mesas.save(new Mesa(peticion.numero(), nombreLimpio(peticion)));
        return new MesaResponse(mesa.getId(), mesa.getNumero(), mesa.getNombre(), mesa.isActiva());
    }

    @PutMapping("/{id}")
    public MesaResponse actualizar(
            @PathVariable Long id, @Valid @RequestBody MesaRequest peticion) {
        Mesa mesa = buscar(id);
        if (!mesa.getNumero().equals(peticion.numero()) && mesas.existsByNumero(peticion.numero())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe la mesa " + peticion.numero());
        }
        mesa.setNumero(peticion.numero());
        mesa.setNombre(nombreLimpio(peticion));
        mesas.save(mesa);
        return new MesaResponse(mesa.getId(), mesa.getNumero(), mesa.getNombre(), mesa.isActiva());
    }

    /** No se puede retirar una mesa con la cuenta abierta: hay clientes en ella. */
    @PostMapping("/{id}/alternar")
    public MesaResponse alternarEstado(@PathVariable Long id) {
        Mesa mesa = buscar(id);
        if (mesa.isActiva() && comandas.findByMesaIdAndEstado(id, Comanda.ABIERTA).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "La mesa tiene una cuenta abierta; cóbrala o anúlala primero");
        }
        mesa.setActiva(!mesa.isActiva());
        mesas.save(mesa);
        return new MesaResponse(mesa.getId(), mesa.getNumero(), mesa.getNombre(), mesa.isActiva());
    }

    private Mesa buscar(Long id) {
        return mesas.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "La mesa no existe"));
    }

    private String nombreLimpio(MesaRequest peticion) {
        if (peticion.nombre() == null) return null;
        String limpio = peticion.nombre().trim();
        return limpio.isEmpty() ? null : limpio;
    }
}
