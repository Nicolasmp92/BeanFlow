package io.github.nicolasmp92.beanflow.comandas;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComandaItemRepository extends JpaRepository<ComandaItem, Long> {

    List<ComandaItem> findByEstadoInOrderByCreadoEnAsc(List<String> estados);
}
