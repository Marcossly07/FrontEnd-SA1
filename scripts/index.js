async function mostrarQuantidade() {
  try {
    let resposta = await fetch("https://6abae78c5b549d818d62b557.mockapi.io/api/v1/entradas-e-saidas");
    let dados = await resposta.json();
    let total = 0;

    dados.forEach(pastilha => {
      if (pastilha.retirada=="não"){
        total += Number(pastilha.quantidade);
      }
    });
    
    if(total > 0){
      document.getElementById("quantidade").innerText = total;
    }
    else{
      document.getElementById("quantidade").innerText = "NENHUMA PASTILHA NO ESTOQUE";
    }

  } catch (erro) {
    console.log("Erro:", erro);
  }
}

mostrarQuantidade();

const input = document.getElementById("pesquisa");
const resultado = document.getElementById("resultado");
input.addEventListener("input", function () {
  let filtro = this.value.toLowerCase();

  resultado.innerHTML = "";

  if (filtro === "") return;

  let filtrados = dados.filter(item =>
    item.fornecedor.toLowerCase().includes(filtro)
  );

  filtrados.forEach(item => {
    let div = document.createElement("div");

    div.innerText = `${item.fornecedor} | Qtd: ${item.quantidade}`;

    div.style.padding = "8px";
    div.style.cursor = "pointer";
    div.style.background = "#767676";
    div.style.borderBottom = "1px solid #0b0a0a";

    div.addEventListener("mouseover", () => {
      div.style.background = "#646464";
    });

    div.addEventListener("mouseout", () => {
      div.style.background = "red";
    });

    div.addEventListener("click", () => {
      input.value = item.fornecedor;
      resultado.innerHTML = "";
    });

    resultado.appendChild(div);
  });

  resultado.style.position = "absolute";
  resultado.style.top = "40px";
  resultado.style.width = input.offsetWidth + "px";
  resultado.style.background = "white";
  resultado.style.border = "1px solid #ccc";
  resultado.style.maxHeight = "200px";
  resultado.style.overflowY = "auto";
  resultado.style.zIndex = "1000";
});

function mostrarInfo(item) {
  let div = document.getElementById("infoProduto");

  div.innerHTML = `
    <div style="
      margin-top:10px;
      padding:10px;
      border:1px solid #ccc;
      background:#fff;
    ">
      <h3>${item.fornecedor}</h3>
      <p><strong>Classe:</strong> ${item.classe}</p>
      <p><strong>Quantidade:</strong> ${item.quantidade}</p>
      <p><strong>Cadastrado por:</strong> ${item.cadastrante}</p>
      <p><strong>Retirada:</strong> ${item.retirada}</p>
    </div>
  `;
}

async function mostrarQuantidadeFornecedores() {
  let resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/fornecedor");
  let dados = await resposta.json();

  document.getElementById("fornecedores").innerText = dados.length;
}

mostrarQuantidadeFornecedores();

async function alertaEstoqueMinimo() {
  let resposta = await fetch("https://6abae78c5b549d818d62b557.mockapi.io/api/v1/entradas-e-saidas");
  let dados = await resposta.json();

  let limite = 20;
  let maiorQuantidade = ""
  dados.forEach(pastilha => {
    if (pastilha.retirada=="não"){

      if (pastilha.quantidade <= 20) {
        document.getElementById("alerta_de_estoque_min").innerText = `${pastilha.idPastilha} EM FALTA!`
      }
      else {
        document.getElementById("alerta_de_estoque_min").innerText = `.....`
      }
    }
  });
  let baixos = dados.filter(item => Number(item.quantidade) <= limite);
}

alertaEstoqueMinimo();

async function cincoMenoresEstoques() {
  try {
    let resposta = await fetch("https://6abae78c5b549d818d62b557.mockapi.io/api/v1/entradas-e-saidas");
    let dados = await resposta.json();

    // Considera apenas registros em que retirada seja "não"
    let dadosValidos = dados.filter(item => item.retirada === "não");

    // Ordena do menor para o maior e pega os 5 primeiros
    let menores = [...dadosValidos]
      .sort((a, b) => Number(a.quantidade) - Number(b.quantidade))
      .slice(0, 5);

    let container = document.getElementById("menores_estoques");
    container.innerHTML = "";

    menores.forEach(pastilha => {
      let linha = document.createElement("div");
      linha.style.display = "flex";
      linha.style.justifyContent = "flex-start";
      linha.style.gap = "8px";

      let nome = document.createElement("span");
      nome.innerText = (pastilha.idPastilha ?? pastilha.fornecedor ?? pastilha.id) + ":";

      let qtd = document.createElement("strong");
      qtd.innerText = pastilha.quantidade;

      linha.appendChild(nome);
      linha.appendChild(qtd);
      container.appendChild(linha);
    });

  } catch (erro) {
    console.log("Erro:", erro);
  }
}

cincoMenoresEstoques();

async function pastilhaEmAlta() {
  try {
    let resposta = await fetch("https://6abae78c5b549d818d62b557.mockapi.io/api/v1/entradas-e-saidas");
    let dados = await resposta.json();

    // Considera apenas registros que não foram retirados
    let dadosValidos = dados.filter(item => item.retirada === "não");

    if (!dadosValidos.length) return;

    // Encontra a pastilha com a maior quantidade
    let maior = dadosValidos.reduce((max, atual) =>
      Number(atual.quantidade) > Number(max.quantidade) ? atual : max
    );

    document.getElementById("pastilha_em_alta").innerText =
      maior.idPastilha ?? maior.fornecedor ?? maior.id;

    document.getElementById("pastilha_em_alta_qtd").innerText =
      `Qtd: ${maior.quantidade}`;

  } catch (erro) {
    console.log("Erro:", erro);
  }
}

pastilhaEmAlta();
// document.getElementById("alerta_de_estoque_min").innerText = baixos.length;

