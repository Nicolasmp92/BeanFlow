package io.github.nicolasmp92.beanflow.comandas;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComandaRepository extends JpaRepository<Comanda, Long> {

    List<Comanda> findByEstadoOrderByAbiertaEnAsc(String estado);

    Optional<Comanda> findByMesaIdAndEstado(Long mesaId, String estado);

    List<Comanda> findByEstadoAndCerradaEnAfterOrderByCerradaEnDesc(
            String estado, OffsetDateTime desde);

    List<Comanda> findAllByOrderByIdDesc(Pageable pageable);
}
