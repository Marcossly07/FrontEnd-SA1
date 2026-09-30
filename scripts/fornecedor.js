const form = document.getElementById("forms");
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

        // Adiciona as células dentro da nova linha
        novaLinha.appendChild(tdNome);
        novaLinha.appendChild(tdCnpj);
        novaLinha.appendChild(tdTelefone);
        novaLinha.appendChild(tdEmail);

        // Adiciona a linha diretamente no corpo da tabela em tempo real
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