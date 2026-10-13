package io.github.nicolasmp92.beanflow.insumos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * Asiento del libro de inventario. Toda variación de stock deja uno: sin
 * movimiento no hay cambio de saldo. Guarda el saldo resultante para auditar
 * sin recalcular toda la historia.
 */
@Entity
@Table(name = "movimientos_insumo")
public class MovimientoInsumo {

    public static final String ENTRADA = "entrada";
    public static final String SALIDA = "salida";
    public static final String AJUSTE = "ajuste";
    public static final String MERMA = "merma";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "insumo_id", nullable = false)
    private Insumo insumo;

    @Column(nullable = false, length = 16)
    private String tipo;

    /** Siempre positiva: el signo lo da el tipo. */
    @Column(nullable = false)
    private BigDecimal cantidad;

    @Column(name = "stock_resultante", nullable = false)
    private BigDecimal stockResultante;

    private String motivo;

    @Column(name = "usuario_id")
    private Long usuarioId;

    /** Enlaza el consumo con la línea de comanda que lo originó. */
    @Column(name = "comanda_item_id")
    private Long comandaItemId;

    @Column(name = "creado_en", nullable = false)
    private OffsetDateTime creadoEn;

    @PrePersist
    void alCrear() {
        creadoEn = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Insumo getInsumo() {
        return insumo;
    }

    public void setInsumo(Insumo insumo) {
        this.insumo = insumo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getCantidad() {
        return cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getStockResultante() {
        return stockResultante;
    }

    public void setStockResultante(BigDecimal stockResultante) {
        this.stockResultante = stockResultante;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getComandaItemId() {
        return comandaItemId;
    }

    public void setComandaItemId(Long comandaItemId) {
        this.comandaItemId = comandaItemId;
    }

    public OffsetDateTime getCreadoEn() {
        return creadoEn;
    }
}
