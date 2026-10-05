package io.github.nicolasmp92.beanflow.mesas;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MesaRepository extends JpaRepository<Mesa, Long> {

    List<Mesa> findByActivaTrueOrderByNumeroAsc();

    List<Mesa> findAllByOrderByNumeroAsc();

    boolean existsByNumero(Integer numero);
}
