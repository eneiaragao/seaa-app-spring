package com.seaa_app.seaa_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.seaa_app.seaa_app.model.ConselhoAluno;

public interface ConselhoRepository extends JpaRepository<ConselhoAluno, Long> {
}