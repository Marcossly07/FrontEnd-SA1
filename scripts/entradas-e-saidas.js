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
const API_URL = "https://6ab95468f84897980b728b5b.mockapi.io/api";


function renderizarTabela(tbodyElement, listaDados, incluirFuncao = false) {
  tbodyElement.innerHTML = ''; // Limpa o conteúdo anterior

  if (listaDados.length === 0) {
    tbodyElement.innerHTML = '<tr><td colspan="6">Nenhum registro encontrado.</td></tr>';
    return;
  }

  listaDados.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id || '-'}</td>
      <td>${item.fornecedor || '-'}</td>
      <td>${item.classe || '-'}</td>
      <td>${item.quantidade || 0}</td>
      <td>R$ ${parseFloat(item.preco || 0).toFixed(2)}</td>
      <td>${incluirFuncao ? (item.funcao || '-') : (item.notaFiscal || '-')}</td>
    `;
    tbodyElement.appendChild(tr);
  });
}

// 1. Carregar Tabela de Entradas (GET /entradas)
async function carregarEntradas() {
  try {
    const resposta = await fetch(`${API_URL}/entradas`);
    if (!resposta.ok) throw new Error(`Status HTTP: ${resposta.status}`);
    const dados = await resposta.json();
    renderizarTabela(tabelaEntradas, dados);
  } catch (erro) {
    console.error('Erro ao carregar entradas:', erro);
    tabelaEntradas.innerHTML = '<tr><td colspan="6">Erro ao carregar dados de entradas.</td></tr>';
  }
}

// 2. Carregar Tabela de Saídas (GET /saidas)
async function carregarSaidas() {
  try {
    const resposta = await fetch(`${API_URL}/saidas`);
    if (!resposta.ok) throw new Error(`Status HTTP: ${resposta.status}`);
    const dados = await resposta.json();
    renderizarTabela(tabelaSaidas, dados);
  } catch (erro) {
    console.error('Erro ao carregar saídas:', erro);
    tabelaSaidas.innerHTML = '<tr><td colspan="6">Erro ao carregar dados de saídas.</td></tr>';
  }
}

// 3. Filtrar registros por classe
formFiltro.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const termoBusca = inputFiltro.value.trim();

  if (!termoBusca) {
    tabelaFiltro.innerHTML = '<tr><td colspan="6">Digite uma classe para pesquisar.</td></tr>';
    return;
  }

  try {
    // A MockAPI permite filtrar diretamente na URL passando a chave como parâmetro (ex: ?classe=valor)
    const resposta = await fetch(`${API_URL}/historico?classe=${encodeURIComponent(termoBusca)}`);
    if (!resposta.ok) throw new Error(`Status HTTP: ${resposta.status}`);
    const dados = await resposta.json();
    
    renderizarTabela(tabelaFiltro, dados, true);
  } catch (erro) {
    console.error('Erro na filtragem:', erro);
    tabelaFiltro.innerHTML = '<tr><td colspan="6">Erro ao buscar no filtro.</td></tr>';
  }
});

// Executa o carregamento das tabelas ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
  carregarEntradas();
  carregarSaidas();
});