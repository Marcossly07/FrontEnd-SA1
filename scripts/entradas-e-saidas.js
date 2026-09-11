const dadosSalvos = localStorage.getItem("estoque");
const objetoFinal = JSON.parse(dadosSalvos);
console.log(objetoFinal)
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

const tbodyEntradas = document.getElementById("tabela-entradas");
let linhas_entradas = "";
Object.keys(objetoFinal).forEach(chave => {
    Object.keys(objetoFinal[chave]).forEach(classe => {
        if(objetoFinal[chave][classe]["Quantidade"]>1){
            linhas_entradas += `
                <tr>
                    <td>${objetoFinal[chave][classe]["Id"]}</td>
                    <td>${chave}</td>
                    <td>${classe}</td>
                    <td>${objetoFinal[chave][classe]["Quantidade"]}</td>
                    <td>${objetoFinal[chave][classe]["Quantidade"] * 90},00</td>
                    <td><button>Nota Fiscal</button></td>
                </tr>
            `;}
        else{
            console.log(objetoFinal[chave][classe]["Quantidade"])
            linhas_entradas += `
                <tr class="pouca_quantidade">
                    <td>${objetoFinal[chave][classe]["Id"]}</td>
                    <td>${chave}</td>
                    <td>${classe}</td>
                    <td>${objetoFinal[chave][classe]["Quantidade"]}</td>
                    <td>${objetoFinal[chave][classe]["Quantidade"] * 90},00</td>
                    <td><button><a href="../templates/cadastro.html" class="link">Solicitar</a></button></td>
                </tr>`;
        }
    })

    tbodyEntradas.innerHTML = linhas_entradas;
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

