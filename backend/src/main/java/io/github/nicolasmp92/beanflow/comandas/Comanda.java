package io.github.nicolasmp92.beanflow.comandas;

import io.github.nicolasmp92.beanflow.mesas.Mesa;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Cuenta abierta: a diferencia de una venta de mostrador, vive en el tiempo
 * (se abre, crece con los pedidos y se cierra al cobrar). Con mesa nula es
 * una venta para llevar.
 */
@Entity
@Table(name = "comandas")
public class Comanda {

    public static final String ABIERTA = "abierta";
    public static final String COBRADA = "cobrada";
    public static final String ANULADA = "anulada";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mesa_id")
    private Mesa mesa;

    @Column(nullable = false, length = 16)
    private String estado = ABIERTA;

    @Column(nullable = false)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(name = "metodo_pago", length = 16)
    private String metodoPago;

    @Column(columnDefinition = "text")
    private String nota;

    @Column(name = "abierta_por_id", nullable = false)
    private Long abiertaPorId;

    @Column(name = "cobrada_por_id")
    private Long cobradaPorId;

    @Column(name = "abierta_en", nullable = false)
    private OffsetDateTime abiertaEn;

    @Column(name = "cerrada_en")
    private OffsetDateTime cerradaEn;

    @OneToMany(mappedBy = "comanda", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<ComandaItem> items = new ArrayList<>();

    @PrePersist
    void alCrear() {
        abiertaEn = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Mesa getMesa() {
        return mesa;
    }

    public void setMesa(Mesa mesa) {
        this.mesa = mesa;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getNota() {
        return nota;
    }

    public void setNota(String nota) {
        this.nota = nota;
    }

    public Long getAbiertaPorId() {
        return abiertaPorId;
    }

    public void setAbiertaPorId(Long abiertaPorId) {
        this.abiertaPorId = abiertaPorId;
    }

    public Long getCobradaPorId() {
        return cobradaPorId;
    }

    public void setCobradaPorId(Long cobradaPorId) {
        this.cobradaPorId = cobradaPorId;
    }

    public OffsetDateTime getAbiertaEn() {
        return abiertaEn;
    }

    public OffsetDateTime getCerradaEn() {
        return cerradaEn;
    }

    public void setCerradaEn(OffsetDateTime cerradaEn) {
        this.cerradaEn = cerradaEn;
    }

    public List<ComandaItem> getItems() {
        return items;
    }
}
