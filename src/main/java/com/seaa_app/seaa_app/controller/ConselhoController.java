package com.seaa_app.seaa_app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.seaa_app.seaa_app.model.ConselhoAluno;
import com.seaa_app.seaa_app.repository.ConselhoRepository;

@RestController
@RequestMapping("/api/conselho")
@CrossOrigin(origins = "*")
public class ConselhoController {

    @Autowired
    private ConselhoRepository repo;

    @PostMapping("/inserir")
    public ResponseEntity<?> inserir(@RequestBody ConselhoAluno aluno) {
        return ResponseEntity.ok(repo.save(aluno));
    }

   @GetMapping("/listar")
public ResponseEntity<?> listar() {
    return ResponseEntity.ok(repo.findAll());
}

@GetMapping("/buscar")
public ResponseEntity<?> buscar(@RequestParam String nome) {
    return ResponseEntity.ok(
        repo.findAll().stream()
            .filter(a -> a.getNome().toLowerCase().contains(nome.toLowerCase()))
            .toList()
    );
}
}