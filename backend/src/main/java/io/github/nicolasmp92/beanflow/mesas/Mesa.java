package io.github.nicolasmp92.beanflow.mesas;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Mesa del salón. Su "estado" (libre/ocupada) no se guarda: se deriva de si
 *  tiene una comanda abierta — un solo lugar de verdad. */
@Entity
@Table(name = "mesas")
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer numero;

    /** Alias opcional: "Terraza 1", "Ventana". */
    private String nombre;

    @Column(nullable = false)
    private boolean activa = true;

    public Mesa() {
    }

    public Mesa(Integer numero, String nombre) {
        this.numero = numero;
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public boolean isActiva() {
        return activa;
    }

    public void setActiva(boolean activa) {
        this.activa = activa;
    }
}
