const dadosSalvos = localStorage.getItem("estoque");
const objetoFinal = JSON.parse(dadosSalvos);
const dadosRetiradas = localStorage.getItem("retiradas")
const retiradasHistorico = JSON.parse(dadosRetiradas);
let produtos_cadastrados = objetoFinal;
const tbody = document.getElementById("minha-tabela-filtro");
let linhas = "";
let formulario = document.getElementById("form-id");
formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    linhas = ``;
    const inputid = document.getElementById("input-id").value.toUpperCase();
    if (objetoFinal) {
        Object.keys(objetoFinal).forEach(chave => {
            console.log("CHAVE", chave);
            Object.keys(objetoFinal[chave]).forEach(classe => {
                console.log("CLASSE", classe);
                if (classe == inputid) {
                    linhas += `
                        <tr>
                        <td>${objetoFinal[chave][classe]["Id"]}</td>
                        <td>${chave}</td>
                        <td>${inputid}</td>
                        <td>${objetoFinal[chave][classe]["Quantidade"]}</td>
                        <td>${objetoFinal[chave][classe]["Quantidade"] * 90},00</td>
                        <td><button>Nota Fiscal</button></td>
                        </tr>
                    `;
                }
                tbody.innerHTML = linhas;
            })
        });
    }
})

const tbodySaidas = document.getElementById("tabela-saidas");
let linhas_saidas = "";
if (retiradasHistorico) {
    for (let i = 0; i < retiradasHistorico.length; i++) {
        linhas_saidas += `
        <tr>
            <td>${retiradasHistorico[i].Id}</td>
            <td>${retiradasHistorico[i].Fornecedor}</td>
            <td>${retiradasHistorico[i].Classe}</td>
            <td>${retiradasHistorico[i].Quantidade}</td>
            <td>R$${retiradasHistorico[i].Quantidade * 90},00</td>
            <td><button>Imprimir</button></td>
        </tr>
            `;
    };
    tbodySaidas.innerHTML = linhas_saidas;

}

async function verPastilhas() {
    const resposta=await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas");
    const dados=await resposta.json();
    return dados
};

const dados=verPastilhas()
verPastilhas().then(dados=>{
    const tbodyEntradas = document.getElementById("tabela-entradas");
    let linhas_entradas = "";
    console.log(dados);
    Object.keys(dados).forEach(chave =>{
        console.log(chave);
        Object.keys(chave).forEach(classe =>{
            console.log(classe);
            linhas_entradas+=`
                <tr>
                    <td>${dados[chave][classe]}</td>
                <td><button>Imprimir</button></td>
        </tr>`;
        });
    });
    tbodyEntradas.innerHTML=linhas_entradas;
})