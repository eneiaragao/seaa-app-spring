package com.seaa_app.seaa_app.repository;

import com.seaa_app.seaa_app.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    
    // Busca por nome garantindo que tudo seja comparado em maiúsculo no banco
    @Query("SELECT a FROM Aluno a WHERE UPPER(a.nomeAluno) LIKE UPPER(CONCAT('%', :nome, '%'))")
    List<Aluno> findByNomeAlunoContainingIgnoreCase(@Param("nome") String nome);
    
    // Busca por turma (também ignorando maiúsculas/minúsculas para evitar erros de digitação)
    @Query("SELECT a FROM Aluno a WHERE UPPER(a.turma) = UPPER(:turma)")
    List<Aluno> findByTurma(@Param("turma") String turma);
    
    // Busca por número do processo SEI
    @Query("SELECT a FROM Aluno a WHERE a.numeroProcessoSei = :numeroProcessoSei")
    List<Aluno> findByNumeroProcessoSei(@Param("numeroProcessoSei") String numeroProcessoSei);
}