package io.github.nicolasmp92.beanflow.insumos;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimientoInsumoRepository extends JpaRepository<MovimientoInsumo, Long> {

    // open-in-view=false: el libro muestra insumo.nombre fuera de sesión.
    @EntityGraph(attributePaths = {"insumo"})
    List<MovimientoInsumo> findAllByOrderByCreadoEnDesc(Pageable pageable);
}
