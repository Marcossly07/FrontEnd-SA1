async function mostrarQuantidade() {
  try {
    let resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/produtos");

    let dados = await resposta.json();

    console.log(dados);

    let quantidade = dados.length;

    document.getElementById("quantidade").innerText =
      "Quantidade: " + quantidade;

  } catch (erro) {
    console.log("Erro:", erro);
  }
}

mostrarQuantidade();