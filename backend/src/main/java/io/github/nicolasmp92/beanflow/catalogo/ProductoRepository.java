package io.github.nicolasmp92.beanflow.catalogo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByActivoTrueOrderByNombreAsc();

    List<Producto> findAllByOrderByNombreAsc();

    boolean existsByCategoriaIdAndActivoTrue(Long categoriaId);
}
