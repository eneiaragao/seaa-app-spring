package com.seaa_app.seaa_app.controller;

import com.seaa_app.seaa_app.model.Aluno;
import com.seaa_app.seaa_app.model.Devolutiva;
import com.seaa_app.seaa_app.repository.AlunoRepository;
import com.seaa_app.seaa_app.repository.DevolutivaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class AlunoController {

    @Autowired
    private AlunoRepository repo;

    @Autowired
    private DevolutivaRepository devolutivaRepo;

    @PostMapping("/inserir-aluno")
    public ResponseEntity<?> inserir(@RequestBody Aluno aluno) {
        try {
            Aluno salvo = repo.save(aluno); 
            return ResponseEntity.ok(salvo); 
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erro ao salvar aluno", "details", e.getMessage()));
        }
    }

    @PostMapping("/inserir-devolutiva")
    public ResponseEntity<?> inserirDevolutiva(@RequestBody Devolutiva dev) {
        try {
            Devolutiva salva = devolutivaRepo.save(dev);
            return ResponseEntity.ok(Map.of("message", "Devolutiva registrada com sucesso!", "id", salva.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erro ao salvar devolutiva", "details", e.getMessage()));
        }
    }

    @PostMapping("/pesquisa-nome")
    public ResponseEntity<?> pesquisarNome(@RequestBody Map<String, String> body) {
        String termo = body.getOrDefault("termo", "");
        List<Aluno> alunos = repo.findByNomeAlunoContainingIgnoreCase(termo);
        return ResponseEntity.ok(Map.of("alunos", processarListaComDevolutivas(alunos)));
    }

    @PostMapping("/pesquisa-turma")
    public ResponseEntity<?> pesquisarTurma(@RequestBody Map<String, String> body) {
        String termo = body.getOrDefault("termo", "");
        List<Aluno> alunos = repo.findByTurma(termo);
        return ResponseEntity.ok(Map.of("alunos", processarListaComDevolutivas(alunos)));
    }

    @PostMapping("/pesquisa-processo")
    public ResponseEntity<?> pesquisarProcesso(@RequestBody Map<String, String> body) {
        String termo = body.getOrDefault("termo", "");
        List<Aluno> alunos = repo.findByNumeroProcessoSei(termo);
        return ResponseEntity.ok(Map.of("alunos", processarListaComDevolutivas(alunos)));
    }

    @PostMapping("/pesquisa-avancada")
    public ResponseEntity<?> pesquisarAvancada() {
        List<Aluno> todos = repo.findAll();
        return ResponseEntity.ok(Map.of("alunos", processarListaComDevolutivas(todos)));
    }

    private List<Map<String, Object>> processarListaComDevolutivas(List<Aluno> alunos) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Aluno a : alunos) {
            List<Devolutiva> devs = devolutivaRepo.findByAlunoId(a.getId());
            if (devs == null || devs.isEmpty()) {
                resultado.add(mapearAluno(a, null));
            } else {
                for (Devolutiva d : devs) {
                    resultado.add(mapearAluno(a, d));
                }
            }
        }
        return resultado;
    }

    private Map<String, Object> mapearAluno(Aluno a, Devolutiva d) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", a.getId());
        // AJUSTE AQUI: Precisamos do ID da devolutiva para o botão excluir do JS funcionar
        map.put("id_devolutiva", d != null ? d.getId() : null); 
        map.put("nome_aluno", a.getNomeAluno()); 
        map.put("turma", a.getTurma());
        map.put("numero_processo_sei", a.getNumeroProcessoSei());
        map.put("contato", a.getContato());
        map.put("data_envio", a.getDataEnvio());
        map.put("data_devolutiva", d != null ? d.getDataDevolutiva() : null);
        map.put("comentario", d != null ? d.getComentario() : "Sem registro");
        map.put("encaminhamento_especialista", d != null ? d.getEncaminhamentoEspecialista() : "Nenhum");
        return map;
    }

    @DeleteMapping("/excluir-aluno/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (repo.existsById(id)) {
            List<Devolutiva> devs = devolutivaRepo.findByAlunoId(id);
            if (!devs.isEmpty()) {
                devolutivaRepo.deleteAll(devs);
            }
            repo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Aluno e histórico excluídos!"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Aluno não encontrado."));
    }

    @DeleteMapping("/excluir-devolutiva/{id}")
    public ResponseEntity<?> excluirDevolutiva(@PathVariable Long id) {
        if (devolutivaRepo.existsById(id)) {
            devolutivaRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Devolutiva excluída com sucesso!"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Devolutiva não encontrada."));
    }
}