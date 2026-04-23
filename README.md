# SEAA-app (Sistema de Entrega de Atividades de Alunos)

O **SEAA-app** é uma solução desenvolvida para otimizar o gerenciamento de relatórios, atividades e processos administrativos escolares, com foco inicial no atendimento às necessidades do **CEF 02 do Arapoanga**.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **Java 17**: Linguagem principal do sistema.
* **Spring Boot 3.4.3**: Framework para agilizar o desenvolvimento da API e do servidor.
* **Spring Data JPA**: Para persistência de dados e mapeamento objeto-relacional.
* **H2 Database**: Banco de dados relacional embutido (funciona em modo arquivo local).
* **Maven**: Gerenciador de dependências e automação de build.
* **HTML/CSS/JavaScript**: Para a interface do usuário (Frontend).

---

## 🛠️ O que é necessário para rodar?

Para executar este projeto em sua máquina local, você precisará ter instalado:

1.  **Java JDK 17**: Certifique-se de que a variável de ambiente `JAVA_HOME` esteja configurada.
2.  **Maven**: Necessário para gerenciar as dependências (ou utilize o `mvnw` incluso no projeto).
3.  **Navegador Web**: Chrome, Edge ou Firefox para acessar a interface.

---

## ⚙️ Como rodar a aplicação

Existem duas formas de iniciar o sistema:

### 1. Usando os Atalhos de Automação (Recomendado para Windows)
Na raiz do projeto, você encontrará arquivos `.bat` que facilitam o controle:

* **`Ligar_Desligar_SEAA.bat`**: Atua como um interruptor. 
    * Se o sistema estiver desligado, ele inicia o servidor e abre o navegador automaticamente em `http://localhost:8080`.
    * Se o sistema estiver ligado, ele encerra o processo Java com segurança, liberando a porta 8080 e o banco de dados.
* **`Fechar_e_Backup.bat`**: Encerra a aplicação e garante a integridade dos dados.

### 2. Via Terminal (Manual)
Caso prefira o terminal, execute o comando na raiz do projeto:
```bash
mvn spring-boot:run
