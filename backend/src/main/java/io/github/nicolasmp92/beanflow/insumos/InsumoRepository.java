package io.github.nicolasmp92.beanflow.insumos;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    List<Insumo> findByActivoTrueOrderByNombreAsc();

    List<Insumo> findAllByOrderByNombreAsc();
}
