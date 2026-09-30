const form = document.getElementById("forms");
const btnConfirm = document.getElementById("btn-confirm");
const tbody = document.getElementById("body-table");

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


        btnEditar.addEventListener("click", (event) => {
            event.preventDefault();
            
            let emEdicao = false;
            
            if(!emEdicao){
                const h1 = document.getElementById("titulo")
                h1.textContent = "Edição do Fornecedor"
    
                const btnConfirm = document.getElementById("btn-confirm")
                btnConfirm.textContent = "Salvar"
    
                const inputNome = document.getElementById("nome");
                inputNome.value = fornecedor.nome
    
                const inputCnpj = document.getElementById("cnpj");
                inputCnpj.value = fornecedor.cnpj
    
                const inputTelefone = document.getElementById("telefone");
                inputTelefone.value = fornecedor.telefone
    
                const inputEmail = document.getElementById("email");
                inputEmail.value = fornecedor.email

                const nome = 

                let emEdicao = true;
            }
            else{
                // 2. Salva os dados: pega os valores dos inputs e volta para texto
                fornecedor.nome = inputNome.value
                fornecedor.cnpj = inputCnpj.value
                fornecedor.telefone = inputTelefone.value
                fornecedor.email = inputEmail.value

                console.log("iaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                console.log("Dados atualizados no objeto:", fornecedor);
                // Aqui você pode fazer um fetch() para atualizar no seu banco de dados
                let emEdicao = false;
            }
            
        });

        // Cria o botão de Excluir
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.style.width = "55px"
        btnExcluir.style.backgroundColor = "#ED2100"

        btnExcluir.addEventListener("click", () => {
            if (confirm(`Excluir fornecedor ${fornecedor.nome}?`)) {
                novaLinha.remove();
            }
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

            const resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/fornecedor", {
                method: "POST",
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