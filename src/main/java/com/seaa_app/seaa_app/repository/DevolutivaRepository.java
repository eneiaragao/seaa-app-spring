package com.seaa_app.seaa_app.repository;

import com.seaa_app.seaa_app.model.Devolutiva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DevolutivaRepository extends JpaRepository<Devolutiva, Long> {
    List<Devolutiva> findByAlunoId(Long alunoId);
}
