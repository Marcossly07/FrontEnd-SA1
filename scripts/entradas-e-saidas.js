const tbody = document.getElementById("minha-tabela-filtro");
let linhas = "";
let formulario = document.getElementById("form-id");
formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    linhas = ``;
    const inputid = document.getElementById("input-id").value.toUpperCase();
    async function buscarId() {
        const buscar = await fetch(`https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas/${inputid}`);
        const dados = await buscar.json();
        if (buscar.status == 200) {
            return dados
        }
        return false

    }
    const dados = buscarId()
    buscarId().then(dados => {
        console.log(dados);
        if (dados["retirada"] == "sim") {
            dados["retirada"] = "Retirada";
        }
        else {
            dados["retirada"] = "Estoque";
        }
        if (dados) {
            linhas += `
                    <tr>
                        <td>${dados["id"]}</td>
                        <td>${dados["fornecedor"]}</td>
                        <td>${dados["classe"]}</td>
                        <td>${dados["quantidade"]}</td>
                        <td>${dados["quantidade"] * 90},00</td>
                        <td>${dados["retirada"]}</td>
                        <td><button class="botao-excluir">🗑️</button></td>
                        </tr>
                    `;
            tbody.innerHTML = linhas;
            async function deletarPastilha(id) {
                const resposta = await fetch(`https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas/${id}`, {
                    method: "DELETE"
                })
                console.log(resposta.status);
                if (resposta.status == 200) {
                    alert("Pastilha excluida com sucesso!")
                    location.reload();
                }
            }
            const botaoDeletar = document.getElementsByClassName("botao-excluir");
            botaoDeletar[0].addEventListener("click", function(){deletarPastilha(dados["id"])});
        }
    })

})


async function verPartilhasRetiradas() {
    const resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas");
    const dados = await resposta.json();
    return dados
}
const dadosRetiradas = verPartilhasRetiradas();
verPartilhasRetiradas().then(retiradas => {
    const tbodySaidas = document.getElementById("tabela-saidas");
    let linhas_saidas = "";
    for (const chave of retiradas) {
        if (chave["retirada"] == "sim") {
            linhas_saidas += `
        <tr>
            <td>${chave["id"]}</td>
            <td>${chave["fornecedor"]}</td>
            <td>${chave["classe"]}</td>
            <td>${chave["quantidade"]}</td>
            <td>R$${chave["quantidade"] * 90},00</td>
            <td><button>Imprimir</button></td>
        </tr>
            `;
        }
    };
    tbodySaidas.innerHTML = linhas_saidas;


})


async function verPastilhas() {
    const resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas");
    const dados = await resposta.json();
    return dados
};

const dados = verPastilhas()
verPastilhas().then(dados => {
    const tbodyEntradas = document.getElementById("tabela-entradas");
    let linhas_entradas = "";
    for (const chave of dados) {
        if (chave["retirada"] == "não") {
            linhas_entradas += `
                    <tr>
                        <td>${chave["id"]}</td>
                        <td>${chave["fornecedor"]}</td>
                        <td>${chave["classe"]}</td>
                        <td>${chave["quantidade"]}</td>
                        <td>${chave["quantidade"] * 90},00</td>
                    <td><button>Imprimir</button></td>
            </tr>`;
        }
    };
    tbodyEntradas.innerHTML = linhas_entradas;
});