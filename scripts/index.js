async function mostrarQuantidade() {
  try {
    let resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas");
    let dados = await resposta.json();

    let total = 0;

    dados.forEach(pastilha => {
      total += Number(pastilha.quantidade);
    });

    document.getElementById("quantidade").innerText = total;

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
  let resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas");
  let dados = await resposta.json();

  let limite = 20;
  let maiorQuantidade = ""
  dados.forEach(pastilha => {
    if (pastilha.quantidade <= 20) {
      document.getElementById("alerta_de_estoque_min").innerText = `${pastilha.idPastilha} EM FALTA!`
    }
    else {
      document.getElementById("alerta_de_estoque_min").innerText = `.....`
    }
  });
  let baixos = dados.filter(item => Number(item.quantidade) <= limite);
}

alertaEstoqueMinimo();

async function cincoMenoresEstoques() {
  try {
    let resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas");
    let dados = await resposta.json();

    // ordena do menor para o maior e pega as 5 primeiras
    let menores = [...dados]
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
    let resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas");
    let dados = await resposta.json();

    if (!dados.length) return;

    // encontra a pastilha com a maior quantidade
    let maior = dados.reduce((max, atual) =>
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

