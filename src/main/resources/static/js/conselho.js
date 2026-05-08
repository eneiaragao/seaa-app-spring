const BASE_URL = 'http://localhost:8080';

let dadosComentarios = [];

// 🔙 BOTÃO VOLTAR
function voltar() {
    window.history.back();
}

// 💾 SALVAR CONSELHO
document.getElementById('form-conselho').addEventListener('submit', (e) => {
    e.preventDefault();

    const dados = {
        nome: document.getElementById('nome').value,
        turma: document.getElementById('turma').value,
        observacao: document.getElementById('observacao').value
    };

    fetch(BASE_URL + '/api/conselho/inserir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(() => {
        alert("Salvo com sucesso!");
        e.target.reset();
    })
    .catch(() => alert("Erro ao salvar"));
});

// 📊 BUSCAR COMENTÁRIOS DOS ALUNOS ENCAMINHADOS
function buscarComentarios() {
    fetch(BASE_URL + '/api/conselho/listar')
    .then(res => res.json())
    .then(data => {

        console.log("DADOS:", data); // 👈 debug

        dadosComentarios = data;

       let html = `
<div class="tabela-container">
    <table class="tabela-bonita">
        <thead>
            <tr>
                <th>Nome</th>
                <th>Turma</th>
                <th>Comentário</th>
            </tr>
        </thead>
        <tbody>
`;

        data.forEach(a => {
            html += `
                <tr>
                    <td>${a.nome}</td>
                    <td>${a.turma}</td>
                    <td>${a.observacao || ''}</td>
                </tr>
            `;
        });

        html += "</table>";

        document.getElementById('resultado-comentarios').innerHTML = html;
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao buscar dados");
    });
}

//mostrar os dados na tabela
function mostrarDados(lista) {
    const tabela = document.getElementById("tabelaDados");
    tabela.innerHTML = "";

    lista.forEach(aluno => {
        const linha = `
            <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.turma}</td>
                <td>${aluno.observacao}</td>
            </tr>
        `;
        tabela.innerHTML += linha;
    });
}
// 📄 GERAR PDF
function gerarPDF() {
    if (!dadosComentarios || dadosComentarios.length === 0) {
        alert("Busque os dados primeiro!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Relatório de Comentários - Conselho", 14, 10);

    doc.autoTable({
        head: [['Nome', 'Turma', 'Comentário']],
        body: dadosComentarios.map(a => [
            a.nome || '',
            a.turma || '',
            a.observacao || ''
        ])
    });

    doc.save("comentarios_conselho.pdf");
}

async function carregarDados() {
    const resposta = await fetch("http://localhost:8080/api/conselho/listar");
    const dados = await resposta.json();

    const tabela = document.getElementById("tabela");
    tabela.innerHTML = "";

    dados.forEach(aluno => {
        tabela.innerHTML += `
            <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.turma}</td>
                <td>${aluno.observacao || ''}</td>
            </tr>
        `;
    });
}
//implementar filtro por nome
function filtrarNome() {
    const valor = document.getElementById("filtro-nome").value.toLowerCase();
    const linhas = document.querySelectorAll(".tabela-bonita tbody tr");

    linhas.forEach(linha => {
        const nome = linha.children[0].innerText.toLowerCase();
        linha.style.display = nome.includes(valor) ? "" : "none";
    });
}