package io.github.nicolasmp92.beanflow.comandas;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComandaRepository extends JpaRepository<Comanda, Long> {

    // open-in-view=false: las respuestas se arman fuera de sesión; mesa e items
    // deben llegar ya cargados o el mapeo a DTO lanza LazyInitializationException.
    @EntityGraph(attributePaths = {"mesa", "items"})
    List<Comanda> findByEstadoOrderByAbiertaEnAsc(String estado);

    Optional<Comanda> findByMesaIdAndEstado(Long mesaId, String estado);

    List<Comanda> findByEstadoAndCerradaEnAfterOrderByCerradaEnDesc(
            String estado, OffsetDateTime desde);

    @EntityGraph(attributePaths = {"mesa", "items"})
    List<Comanda> findAllByOrderByIdDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"mesa", "items"})
    Optional<Comanda> findById(Long id);
}
