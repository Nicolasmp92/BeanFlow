package io.github.nicolasmp92.beanflow.catalogo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecetaItemRepository extends JpaRepository<RecetaItem, Long> {

    List<RecetaItem> findByProductoId(Long productoId);

    List<RecetaItem> findByProductoIdIn(List<Long> productoIds);

    boolean existsByInsumoId(Long insumoId);

    void deleteByProductoId(Long productoId);
}
