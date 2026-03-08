document.addEventListener('DOMContentLoaded', () => {
    // URL do seu backend no Render
    const BASE_URL = 'https://seaa-app-spring.onrender.com'; 

    const btnGerarPdf = document.getElementById('btn-gerar-pdf');
    const resultadosDiv = document.getElementById('area-resultados');
    const areaInsercao = document.getElementById('area-insercao');
    const areaInsercaoDevolutiva = document.getElementById('area-insercao-devolutiva');

    const campos = {
        turma: { container: document.getElementById('campo-pesquisa-turma'), input: document.getElementById('input-turma'), endpoint: '/api/pesquisa-turma' },
        nome: { container: document.getElementById('campo-pesquisa-nome'), input: document.getElementById('input-nome-aluno'), endpoint: '/api/pesquisa-nome' },
        processo: { container: document.getElementById('campo-pesquisa-processo'), input: document.getElementById('input-processo'), endpoint: '/api/pesquisa-processo' }
    };

    // Função para limpar a tela ao trocar de opção
    function resetInterface() {
        Object.values(campos).forEach(c => { c.container.style.display = 'none'; });
        areaInsercao.style.display = 'none';
        areaInsercaoDevolutiva.style.display = 'none';
        resultadosDiv.innerHTML = '';
        btnGerarPdf.style.display = 'none';
    }

    // Eventos dos botões de navegação
    document.getElementById('btn-turma').addEventListener('click', () => { resetInterface(); campos.turma.container.style.display = 'block'; });
    document.getElementById('btn-nome').addEventListener('click', () => { resetInterface(); campos.nome.container.style.display = 'block'; });
    document.getElementById('btn-processo').addEventListener('click', () => { resetInterface(); campos.processo.container.style.display = 'block'; });
    document.getElementById('btn-inserir').addEventListener('click', () => { resetInterface(); areaInsercao.style.display = 'block'; });
    document.getElementById('btn-inserir-devolutiva').addEventListener('click', () => { resetInterface(); areaInsercaoDevolutiva.style.display = 'block'; });

    // Configuração de pesquisa ao apertar Enter
    Object.values(campos).forEach(campo => {
        campo.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') fazerPesquisa(campo.input.value, campo.endpoint);
        });
    });

    // Pesquisa Avançada (Tudo)
    document.getElementById('btn-avancada').addEventListener('click', () => {
        resetInterface();
        fazerPesquisa('', '/api/pesquisa-avancada');
    });

    // Função genérica de busca
    function fazerPesquisa(termo, endpoint) {
        resultadosDiv.innerHTML = '<p>Buscando dados no sistema...</p>';
        fetch(BASE_URL + endpoint, {
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

    // Montagem da tabela de resultados
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
                        <th>Encaminhamento</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>`;

        dados.forEach(item => {
            const data = item.data_devolutiva 
                ? new Date(item.data_devolutiva).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) 
                : '<span style="color:orange">Pendente</span>';

            // Botão para excluir apenas a linha da devolutiva específica
            const botaoExcluirDev = item.id_devolutiva 
                ? `<button onclick="window.excluirDevolutiva(${item.id_devolutiva})" class="btn-excluir-tabela">Excluir Histórico</button>`
                : '---';

            html += `
                <tr>
                    <td>${item.id}</td>
                    <td><strong>${item.nome_aluno}</strong></td>
                    <td>${item.turma}</td>
                    <td>${data}</td>
                    <td>${item.comentario}</td>
                    <td>${item.encaminhamento_especialista || '---'}</td>
                    <td>${botaoExcluirDev}</td>
                </tr>`;
        });

        resultadosDiv.innerHTML = html + '</tbody></table>';
        btnGerarPdf.style.display = 'flex';
    }

    // --- FUNÇÕES DE EXCLUSÃO ---

    // 1. Excluir Devolutiva (Botão na tabela)
    window.excluirDevolutiva = function(idDevolutiva) {
        if (!idDevolutiva) return;
        if (confirm("Deseja excluir permanentemente este registro de histórico?")) {
            fetch(`${BASE_URL}/api/excluir-devolutiva/${idDevolutiva}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error();
                alert("Registro excluído!");
                document.getElementById('btn-avancada').click(); 
            })
            .catch(() => alert("Erro ao excluir devolutiva."));
        }
    };

    // 2. Excluir Aluno Completo (Botão Central por ID)
    document.getElementById('btn-excluir-aluno').addEventListener('click', () => {
        const id = document.getElementById('input-id-excluir').value;
        if (!id) {
            alert("Por favor, digite o ID do aluno para excluir.");
            return;
        }

        if (confirm(`ATENÇÃO: Deseja excluir o aluno ID ${id} e TODO o histórico de devolutivas dele?`)) {
            fetch(`${BASE_URL}/api/excluir-aluno/${id}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    alert("Aluno e histórico removidos com sucesso!");
                    document.getElementById('input-id-excluir').value = '';
                    if(resultadosDiv.innerHTML !== '') document.getElementById('btn-avancada').click();
                } else {
                    alert("Erro: Aluno não encontrado.");
                }
            })
            .catch(() => alert("Erro de conexão ao tentar excluir aluno."));
        }
    });

    // --- FUNÇÕES DE INSERÇÃO ---

    // Salvar Novo Aluno
    document.getElementById('form-insercao').addEventListener('submit', (e) => {
        e.preventDefault();
        const dados = {
            nomeAluno: document.getElementById('input-nome').value,
            turma: document.getElementById('input-turma-insercao').value,
            numeroProcessoSei: document.getElementById('input-processo-insercao').value,
            dataEnvio: document.getElementById('input-data-envio').value,
            contato: document.getElementById('input-contato').value
        };
        fetch(BASE_URL + '/api/inserir-aluno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(res => {
            if(!res.ok) throw new Error();
            alert("Aluno cadastrado com sucesso!");
            resetInterface();
        })
        .catch(() => alert("Erro ao salvar aluno."));
    });

    // Salvar Nova Devolutiva
    document.getElementById('form-insercao-devolutiva').addEventListener('submit', (e) => {
        e.preventDefault();
        const dados = {
            alunoId: document.getElementById('input-aluno-id').value,
            dataDevolutiva: document.getElementById('input-data-devolutiva').value,
            comentario: document.getElementById('input-comentario').value,
            encaminhamentoEspecialista: document.getElementById('input-encaminhamento').value
        };
        fetch(BASE_URL + '/api/inserir-devolutiva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(res => { 
            if(!res.ok) throw new Error(); 
            return res.json(); 
        })
        .then(() => { 
            alert("Devolutiva registrada!"); 
            resetInterface(); 
        })
        .catch(() => alert("Erro ao salvar. Verifique se o ID do aluno está correto."));
    });

    // Gerar PDF do Relatório
    btnGerarPdf.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4');
        doc.text("Relatório SEAA - CEF 02 Arapoanga", 14, 15);
        doc.autoTable({ 
            html: '#tabela-relatorio', 
            startY: 25, 
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }
        });
        doc.save("Relatorio_Arapoanga.pdf");
    });
});