const dadosSalvos = localStorage.getItem("dadosDoAluno");
const objetoFinal = JSON.parse(dadosSalvos);
console.log(objetoFinal)
let produtos_cadastrados = objetoFinal;
const tbody = document.getElementById("minha-tabela-filtro");
let linhas = "";
let formulario = document.getElementById("form-id");
formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    linhas=``;
    const inputid = document.getElementById("input-id").value.toUpperCase();
    for (let i = 0; i < produtos_cadastrados.length; i++) {
        if (produtos_cadastrados[i].Classe == inputid) {
            if (produtos_cadastrados[i].Quantidade < 2) {
                linhas += `
                <tr class="pouca_quantidade">
                <td>${produtos_cadastrados[i].Id}</td>
                <td>${produtos_cadastrados[i].Classe}</td>
                <td>${produtos_cadastrados[i].Quantidade}</td>
                <td>R$${produtos_cadastrados[i].Quantidade * 900},00</td>
                <td><button>Solicitar</button></td>
                </tr>
                `;
            } else {
                linhas += `
                <tr>
                <td>${produtos_cadastrados[i].Id}</td>
                <td>${produtos_cadastrados[i].Classe}</td>
                <td>${produtos_cadastrados[i].Quantidade}</td>
                <td>R$${produtos_cadastrados[i].Quantidade * 900},00</td>
                <td><button>Nota Fiscal</button></td>
                </tr>
                `};
            tbody.innerHTML = linhas;
        }

    }

})

const tbodyEntradas = document.getElementById("tabela-entradas");
let linhas_entradas = "";
for (let i = 0; i < produtos_cadastrados.length; i++) {
    if (produtos_cadastrados[i].quantidade < 2) {
        linhas_entradas += `
            <tr class="pouca_quantidade">
                <td>${produtos_cadastrados[i].Id}</td>
                <td>${produtos_cadastrados[i].Classe}</td>
                <td>${produtos_cadastrados[i].Quantidade}</td>
                <td>R$${produtos_cadastrados[i].Quantidade * 900},00</td>
                <td><button>Solicitar</button></td>
            </tr>
    `;
    } else {
        linhas_entradas += `
            <tr>
                <td>${produtos_cadastrados[i].Id}</td>
                <td>${produtos_cadastrados[i].Classe}</td>
                <td>${produtos_cadastrados[i].Quantidade}</td>
                <td>R$${produtos_cadastrados[i].Quantidade * 900},00</td>
                <td><button>Imprimir</button></td>
            </tr>
    `};
    tbodyEntradas.innerHTML = linhas_entradas;
}