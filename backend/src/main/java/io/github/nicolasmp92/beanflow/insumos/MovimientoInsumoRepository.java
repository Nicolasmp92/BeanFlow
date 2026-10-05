package io.github.nicolasmp92.beanflow.insumos;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimientoInsumoRepository extends JpaRepository<MovimientoInsumo, Long> {

    List<MovimientoInsumo> findAllByOrderByCreadoEnDesc(Pageable pageable);
}
