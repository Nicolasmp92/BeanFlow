package io.github.nicolasmp92.beanflow.catalogo;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // open-in-view=false: la respuesta usa categoria fuera de sesión.
    @EntityGraph(attributePaths = {"categoria"})
    List<Producto> findByActivoTrueOrderByNombreAsc();

    @EntityGraph(attributePaths = {"categoria"})
    List<Producto> findAllByOrderByNombreAsc();

    @EntityGraph(attributePaths = {"categoria"})
    Optional<Producto> findById(Long id);

    boolean existsByCategoriaIdAndActivoTrue(Long categoriaId);
}
