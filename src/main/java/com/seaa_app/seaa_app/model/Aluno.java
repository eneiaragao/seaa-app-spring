package com.seaa_app.seaa_app.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "alunos_encaminhados")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_aluno", length = 85, nullable = false)
    private String nomeAluno;

    @Column(length = 20, nullable = false)
    private String turma;

    @Column(name = "CONTATO", length = 20)
    private String contato;

    @Column(name = "numero_processo_sei", length = 30, nullable = false)
    private String numeroProcessoSei;

    @Column(name = "data_envio", nullable = false)
    private LocalDate dataEnvio;

    public Aluno() {}
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeAluno() { return nomeAluno; }
    public void setNomeAluno(String nomeAluno) { this.nomeAluno = nomeAluno; }
    public String getTurma() { return turma; }
    public void setTurma(String turma) { this.turma = turma; }
    public String getContato() { return contato; }
    public void setContato(String contato) { this.contato = contato; }
    public String getNumeroProcessoSei() { return numeroProcessoSei; }
    public void setNumeroProcessoSei(String numeroProcessoSei) { this.numeroProcessoSei = numeroProcessoSei; }
    public LocalDate getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(LocalDate dataEnvio) { this.dataEnvio = dataEnvio; }
}