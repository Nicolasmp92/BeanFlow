package io.github.nicolasmp92.beanflow.catalogo;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecetaItemRepository extends JpaRepository<RecetaItem, Long> {

    // Carta y admin leen insumo.producto fuera de sesión (open-in-view=false).
    @EntityGraph(attributePaths = {"producto", "insumo"})
    List<RecetaItem> findByProductoId(Long productoId);

    @EntityGraph(attributePaths = {"producto", "insumo"})
    List<RecetaItem> findByProductoIdIn(List<Long> productoIds);

    boolean existsByInsumoId(Long insumoId);

    void deleteByProductoId(Long productoId);
}
