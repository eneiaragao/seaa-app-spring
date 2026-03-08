package com.seaa_app.seaa_app.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "alunos_encaminhados")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeAluno;
    private String turma;
    private String contato;
    private String numeroProcessoSei;
    private LocalDate dataEnvio;

    // Construtores
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