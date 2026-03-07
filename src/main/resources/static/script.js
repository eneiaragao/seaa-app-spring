document.addEventListener('DOMContentLoaded', () => {
    // Referências do DOM
    const btnGerarPdf = document.getElementById('btn-gerar-pdf');
    const resultadosDiv = document.getElementById('area-resultados');
    const areaInsercao = document.getElementById('area-insercao');
    const areaInsercaoDevolutiva = document.getElementById('area-insercao-devolutiva');

    const campos = {
        turma: { container: document.getElementById('campo-pesquisa-turma'), input: document.getElementById('input-turma'), endpoint: '/api/pesquisa-turma' },
        nome: { container: document.getElementById('campo-pesquisa-nome'), input: document.getElementById('input-nome-aluno'), endpoint: '/api/pesquisa-nome' },
        processo: { container: document.getElementById('campo-pesquisa-processo'), input: document.getElementById('input-processo'), endpoint: '/api/pesquisa-processo' }
    };

    function resetInterface() {
        Object.values(campos).forEach(c => { c.container.style.display = 'none'; });
        areaInsercao.style.display = 'none';
        areaInsercaoDevolutiva.style.display = 'none';
        resultadosDiv.innerHTML = '';
        btnGerarPdf.style.display = 'none';
    }

    // --- CONTROLES DE MENU ---
    document.getElementById('btn-turma').addEventListener('click', () => { resetInterface(); campos.turma.container.style.display = 'block'; });
    document.getElementById('btn-nome').addEventListener('click', () => { resetInterface(); campos.nome.container.style.display = 'block'; });
    document.getElementById('btn-processo').addEventListener('click', () => { resetInterface(); campos.processo.container.style.display = 'block'; });
    document.getElementById('btn-inserir').addEventListener('click', () => { resetInterface(); areaInsercao.style.display = 'block'; });
    document.getElementById('btn-inserir-devolutiva').addEventListener('click', () => { resetInterface(); areaInsercaoDevolutiva.style.display = 'block'; });

    // Gatilhos de busca ao apertar Enter
    Object.values(campos).forEach(campo => {
        campo.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') fazerPesquisa(campo.input.value, campo.endpoint);
        });
    });

    document.getElementById('btn-avancada').addEventListener('click', () => {
        resetInterface();
        fazerPesquisa('', '/api/pesquisa-avancada');
    });

    // --- FUNÇÕES DE COMUNICAÇÃO (FETCH) ---

    function fazerPesquisa(termo, endpoint) {
        resultadosDiv.innerHTML = '<p>Buscando dados no sistema...</p>';
        fetch('http://localhost:8080' + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ termo: termo })
        })
        .then(res => res.json())
        .then(data => {
            const lista = data.alunos || data.dados || [];
            exibirTabela(lista);
        })
        .catch(() => {
            resultadosDiv.innerHTML = '<p style="color:red">Erro ao conectar ao servidor.</p>';
        });
    }

    function exibirTabela(dados) {
        if (!dados || dados.length === 0) { 
            resultadosDiv.innerHTML = '<p>Nenhum registro encontrado.</p>'; 
            return; 
        }

        let html = `
            <h3 style="text-align:center">Relatório de Acompanhamento</h3>
            <table class="tabela-resultados" id="tabela-relatorio">
                <thead>
                    <tr>
                        <th>ID Aluno</th>
                        <th>Nome</th>
                        <th>Turma</th>
                        <th>Data Devolutiva</th>
                        <th>Comentário</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>`;

        dados.forEach(item => {
            const data = item.data_devolutiva 
                ? new Date(item.data_devolutiva).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) 
                : '<span style="color:orange">Pendente</span>';

            // Botão Excluir só aparece se houver uma devolutiva vinculada
            const botaoExcluir = item.comentario !== "Sem registro" 
                ? `<button onclick="window.excluirDevolutiva(${item.id_devolutiva})" class="btn-excluir-tabela">Excluir</button>`
                : '---';

            html += `
                <tr>
                    <td>${item.id}</td>
                    <td><strong>${item.nome_aluno}</strong></td>
                    <td>${item.turma}</td>
                    <td>${data}</td>
                    <td>${item.comentario}</td>
                    <td>${botaoExcluir}</td>
                </tr>`;
        });

        resultadosDiv.innerHTML = html + '</tbody></table>';
        btnGerarPdf.style.display = 'flex';
    }

    // --- FUNÇÕES DE EXCLUSÃO ---
    window.excluirDevolutiva = function(idDevolutiva) {
        if (!idDevolutiva) return;
        if (confirm("Deseja excluir permanentemente esta devolutiva?")) {
            fetch(`http://localhost:8080/api/excluir-devolutiva/${idDevolutiva}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error();
                alert("Excluída com sucesso!");
                document.getElementById('btn-avancada').click(); // Atualiza a tabela
            })
            .catch(() => alert("Erro ao excluir."));
        }
    };

    // --- FORMULÁRIOS DE INSERÇÃO ---

    document.getElementById('form-insercao').addEventListener('submit', (e) => {
        e.preventDefault();
        const dados = {
            nomeAluno: document.getElementById('input-nome').value,
            turma: document.getElementById('input-turma-insercao').value,
            numeroProcessoSei: document.getElementById('input-processo-insercao').value,
            dataEnvio: document.getElementById('input-data-envio').value,
            contato: document.getElementById('input-contato').value
        };
        fetch('http://localhost:8080/api/inserir-aluno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        }).then(() => { alert("Aluno salvo!"); resetInterface(); });
    });

    document.getElementById('form-insercao-devolutiva').addEventListener('submit', (e) => {
        e.preventDefault();
        const dados = {
            alunoId: document.getElementById('input-aluno-id').value,
            dataDevolutiva: document.getElementById('input-data-devolutiva').value,
            comentario: document.getElementById('input-comentario').value,
            encaminhamentoEspecialista: document.getElementById('input-encaminhamento').value
        };
        fetch('http://localhost:8080/api/inserir-devolutiva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(res => { if(!res.ok) throw new Error(); return res.json(); })
        .then(() => { alert("Devolutiva salva!"); resetInterface(); })
        .catch(() => alert("Erro ao salvar. Verifique o ID do aluno."));
    });

    // --- PDF ---
    btnGerarPdf.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4');
        doc.text("Relatório SEAA - CEF 02 Arapoanga", 14, 15);
        doc.autoTable({ html: '#tabela-relatorio', startY: 25, theme: 'grid' });
        doc.save("Relatorio_Arapoanga.pdf");
    });
});