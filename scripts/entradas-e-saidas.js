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

}
)

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