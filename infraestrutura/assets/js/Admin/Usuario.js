/* URL Padrão */
const URL = "http://localhost:8080/usuarios/";

document.getElementById("btn_atualizar").addEventListener("click", atualizar);
document.getElementById("btn_novoUsuario").addEventListener("click", Adicionarusuario);
document.getElementById("btn_novoUsuario").addEventListener("click", Adicionarusuario);

const mensagem = document.querySelector("#response_usuarios");

function atualizar() {
    carregarUsuarios();
}

/* Função para pegar os dados da API */
function carregarUsuarios() {
    fetch(URL + "findall")
        .then(resp => resp.json())
        .then(data => {
            const tabela = document.getElementById("tabelaUsuarios"); // Obtendo tbody

            /* Limpando a tabela */
            tabela.innerHTML = "";

            data.content.forEach(usuario => {
                const tr = document.createElement("tr"); // Criando uma nova linha

                /* tr.setAttribute(") => Permiti definir uma atributo que pode ser usada futuramente */
                tr.setAttribute("data-id", usuario.id); // Adicionando atributo com o ID

                //Novo elemento no html
                tr.innerHTML = `
                    <td class="linha">${usuario.id}</td>
                    <td class="linha">${usuario.nome}</td>
                    <td class="linha">${usuario.email}</td>
                    <td class="linha">${usuario.login}</td>
                    <td class="linha">
                        <button class="editar" data-id="${usuario.id}">Editar</button>      
                    </td>
                    <td class="linha">
                        <button class="excluir" data-id="${usuario.id}">Excluir</button>
                    </td>
                `;

                //adicionando linha na tabela
                tabela.appendChild(tr); // Adicionando linha à tabela
            });

            //monitor o eventos dentro da tabela de bottões
            eventosDosBotoes(".excluir"); // Adicionando eventos nos botões
        })
        .catch(error => console.log(error));
}

/* Adicionar evento de clique nos botões de exclusão */
function eventosDosBotoes(metodo) {
    document.querySelectorAll(metodo).forEach(botao => {
        botao.addEventListener("click", function () {
            const id = this.getAttribute("data-id"); // Pegando o ID do usuário
            metodo === ".excluir"? deletarUsuario(id): atualizarUsuario(id);
        });
    });
}

// Excluir o usuário
function deletarUsuario(id) {
    if (confirm("Deseja mesmo excluir este usuário?")) {
        fetch(URL + `delete/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao excluir usuário");
            }
            let mensagem = document.getElementById("response_usuarios");

            mensagem.innerHTML = "<h2>Usuário Deletado com sucesso!</h2>"


            // Removendo a linha da tabela sem necessidade de atualizar a página
            document.querySelector(`tr[data-id="${id}"]`).remove();
        })
        .catch(error => console.error("Erro ao excluir usuário:", error));
    }
}


/*  */
//Adicionar Usuário
function Adicionarusuario(){
 
    // Seleciona o elemento com ID "response_usuarios" onde o formulário será inserido
let form = document.querySelector("#response_usuarios");

// Insere o formulário dentro do elemento selecionado
form.innerHTML = `
    <p>Nome</p><input type="text" id="nome" placeholder="Henrique">
    <p>Usuário</p><input type="text" id="login" placeholder="henriquemart">
    <p>E-mail</p><input type="email" id="email" placeholder="henrique@gmail.com">
    <p>Senha</p><input type="password" id="senha" placeholder="1234">
    <button id="btn_enviar" class="enviar">Enviar</button>
    <button id="btn_cancelar" class="enviar">Cancelar</button>
`;

// Evento para esconder o formulário ao clicar no botão "Cancelar"
document.getElementById("btn_cancelar").addEventListener("click", () => {
    form.innerHTML = ""; // Esvazia o conteúdo do formulário
});

// Evento para enviar os dados ao clicar no botão "Enviar"
document.getElementById("btn_enviar").addEventListener("click", () => {

        // Captura os valores dos inputs e remove espaços extras com trim()
        let nome = document.getElementById("nome").value.trim();
        let login = document.getElementById("login").value.trim();
        let email = document.getElementById("email").value.trim();
        let senha = document.getElementById("senha").value.trim();

        // Validação: Se algum campo estiver vazio, exibe um alerta e interrompe o envio
        if (!nome || !login || !email || !senha) {
            alert("Por favor, preencha todos os campos corretamente!");
            return; // Sai da função sem prosseguir com a requisição
        }

        // Criação do objeto que será enviado na requisição POST
        let usuario = {
            nome: nome,
            login: login,
            email: email,
            senha: senha
        };

        // Confirmação antes de enviar os dados
        if (confirm("Deseja cadastrar esse usuário?")) {
            fetch(URL + "save", { // Faz a requisição POST para o servidor
                method: "POST",
                headers: {
                    "Content-Type": "application/json" // Define o tipo de conteúdo como JSON
                },
                body: JSON.stringify(usuario) // Converte o objeto para uma string JSON antes de enviar
            })
            .then(response => response.json()) // Converte a resposta para JSON
            .then(data => {
                console.log("Usuário cadastrado com sucesso", data);
                form.innerHTML = "<h2> Usuário cadastrado com sucesso!</h2>"; // Exibe mensagem de sucesso
                atualizar(); // Chama uma função externa (possivelmente para atualizar a interface)
            })
            .catch(error => {
                console.error("Erro ao cadastrar usuário", error);
                form.innerHTML = "<h2> Erro ao cadastrar Usuário!</h2>"; // Exibe mensagem de erro
            });
        }
    });

}

/* Modificando usuário */

function atualizarUsuario(id){

    const tabela = document.getElementById("tabelaUsuarios"); // Obtendo tbody

    eventosDosBotoes(".editar");

    mensagem = `
    <p>Nome</p><input type="text" id="nome" placeholder="Henrique">
    <p>Usuário</p><input type="text" id="login" placeholder="henriquemart">
    <p>E-mail</p><input type="email" id="email" placeholder="henrique@gmail.com">
    <p>Senha</p><input type="password" id="senha" placeholder="1234">
    <button id="btn_enviar" class="enviar">Enviar</button>
    <button id="btn_cancelar" class="enviar">Cancelar</button>`;


    /*document.getElementById("btn_enviar").addEventListener("click", () => {
        fetch(URL + `update/${id}`, {

            method: "PUT",
            headers: {
                "Content-Type": "application/json" // Define o tipo de conteúdo como JSON
            },
            body: JSON.stringify(usuario) // Converte o objeto para uma string JSON antes de enviar
        })
        .then(response => response.json()) // Converte a resposta para JSON
            .then(data => {
                console.log("Usuário cadastrado com sucesso", data);
                form.innerHTML = "<h2> Usuário cadastrado com sucesso!</h2>"; // Exibe mensagem de sucesso
                atualizar(); // Chama uma função externa (possivelmente para atualizar a interface)
            })
            .catch(error => {
                console.error("Erro ao cadastrar usuário", error);
                form.innerHTML = "<h2> Erro ao cadastrar Usuário!</h2>"; // Exibe mensagem de erro
            });
        }*/
}
