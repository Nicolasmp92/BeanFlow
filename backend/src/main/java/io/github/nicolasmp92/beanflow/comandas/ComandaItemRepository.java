package io.github.nicolasmp92.beanflow.comandas;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComandaItemRepository extends JpaRepository<ComandaItem, Long> {

    // La cocina muestra mesa por línea; con open-in-view=false el proxy de
    // comanda (y su mesa) debe venir cargado o la vista revienta fuera de sesión.
    @EntityGraph(attributePaths = {"comanda", "comanda.mesa"})
    List<ComandaItem> findByEstadoInOrderByCreadoEnAsc(List<String> estados);

    @EntityGraph(attributePaths = {"comanda", "comanda.mesa"})
    Optional<ComandaItem> findById(Long id);
}
