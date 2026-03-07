package com.seaa_app.seaa_app.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "devolutivas")
public class Devolutiva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aluno_id")
    private Long alunoId;

    @Column(name = "data_devolutiva")
    private LocalDate dataDevolutiva;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "encaminhamento_especialista")
    private String encaminhamentoEspecialista;

    public Devolutiva() {}
    // Getters e Setters (id, alunoId, dataDevolutiva, comentario, encaminhamentoEspecialista)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }
    public LocalDate getDataDevolutiva() { return dataDevolutiva; }
    public void setDataDevolutiva(LocalDate dataDevolutiva) { this.dataDevolutiva = dataDevolutiva; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public String getEncaminhamentoEspecialista() { return encaminhamentoEspecialista; }
    public void setEncaminhamentoEspecialista(String encaminhamentoEspecialista) { this.encaminhamentoEspecialista = encaminhamentoEspecialista; }
}