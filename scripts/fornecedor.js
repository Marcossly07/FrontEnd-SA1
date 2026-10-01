const form = document.getElementById("forms");
const btnConfirm = document.getElementById("btn-confirm");
const tbody = document.getElementById("body-table");
const API_URL = "https://6ab95468f84897980b728b5b.mockapi.io/api/fornecedor";
let idEmEdicao = null;// null = modo cadastro | número = modo edição.

async function listarFornecedor() {
    const resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/fornecedor")

    if (!resposta.ok) {
        throw new Error(`Erro: ${resposta.status}`)
    }
    const dados = await resposta.json();
    return dados
}

const dados = listarFornecedor()

listarFornecedor().then((dados) => {
    console.log(dados)
});

function tratarFornecedores(lista) {
    lista.forEach(fornecedor => {
        const nome = fornecedor.nome
        const cnpj = fornecedor.cnpj
        const telefone = fornecedor.telefone
        const email = fornecedor.email

        const divRow = document.getElementById("row");

        const novaLinha = document.createElement("tr");

        const tdNome = document.createElement("td");
        tdNome.textContent = nome;

        const tdCnpj = document.createElement("td");
        tdCnpj.textContent = cnpj

        const tdTelefone = document.createElement("td");
        tdTelefone.textContent = telefone

        const tdEmail = document.createElement("td");
        tdEmail.textContent = email

        // 1. Cria a célula que vai conter os botões de ação
        const tdAcoes = document.createElement("td");

        // Cria o botão de Editar/Salvar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.style.marginRight = "5px";
        btnEditar.style.marginLeft = "20px";
        btnEditar.style.width = "55px"
        btnEditar.style.backgroundColor = "#FFDE21"


        const btnCancelar = document.createElement("button");
        btnCancelar.textContent = "Cancelar";
        btnCancelar.style.width = "55px"
        btnCancelar.style.backgroundColor = "#ED2100"

        btnEditar.addEventListener("click", (event) => {
            event.preventDefault();

            idEmEdicao = fornecedor.id; //Guarda quem esta sendo editado

            document.getElementById("titulo").textContent = "Edição do Fornecedor"
            btnConfirm.textContent = "Salvar";

            //Mostra os dados do fornecedor na tela
            document.getElementById("nome").value = fornecedor.nome;
            document.getElementById("cnpj").value = fornecedor.cnpj
            document.getElementById("telefone").value = fornecedor.telefone
            document.getElementById("email").value = fornecedor.email

            divRow.appendChild(btnCancelar);
        });


        btnCancelar.addEventListener("click", (event) => {
            window.location.reload()
        })

        // Cria o botão de Excluir
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.style.width = "55px"
        btnExcluir.style.backgroundColor = "#ED2100"

        btnExcluir.addEventListener("click", () => {
            if (!confirm(`Excluir fornecedor ${fornecedor.nome}?`)) return;

            async function excluirFornecedor(id) {
                try {
                    const resposta = await fetch(`https://6ab95468f84897980b728b5b.mockapi.io/api/fornecedor/${id}`, {
                        method: "DELETE"
                    })
                    if (!resposta.ok) {
                        throw new Error(`Erro HTTP: ${resposta.status}`)
                    }
                    novaLinha.remove(); // só remove da tela se o servidor confirmou
                }
                catch (erro) {
                    console.error(
                        "Não foi possivel ex"
                    )
                }
            }
            excluirFornecedor(fornecedor.id)
        });


        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);

        novaLinha.appendChild(tdNome);
        novaLinha.appendChild(tdCnpj);
        novaLinha.appendChild(tdTelefone);
        novaLinha.appendChild(tdEmail);
        novaLinha.appendChild(tdAcoes);

        tbody.appendChild(novaLinha);
    });
}



listarFornecedor().then(tratarFornecedores);


form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cnpj = document.getElementById("cnpj").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    const fornecedor = {
        nome: nome,
        cnpj: cnpj,
        telefone: telefone,
        email: email
    }

    async function adicionarFornecedor(fornecedor) {
        try {
            const url = idEmEdicao ? `${API_URL}/${idEmEdicao}` : API_URL; //verifica se tem id na variavel, se tiver ele salva a url com id, senão ele so salva a url normal
            const metodo = idEmEdicao ? "PUT" : "POST" //se tiver id o metodo sera o "PUT", caso contrario será o "POST"
            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fornecedor)
            })
            if (!resposta.ok) {
                throw new Error(
                    `Erro HTTP: ${resposta.status}`
                );
            }
        } catch (erro) {
            console.error(
                "Não foi possível consultar os produtos:",
                erro
            );
        }

        //Atualiza a pagina automaticamente
        window.location.reload()
    }
    adicionarFornecedor(fornecedor)
});