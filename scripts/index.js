async function mostrarQuantidade() {
  try {
    let resposta = await fetch("https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas");
    let dados = await resposta.json();

    let total = 0;

    dados.forEach(item => {
      if (item.retirada === "não") {
      total += Number(item.quantidade);
      }
    });

    document.getElementById("quantidade").innerText =
      "" + total;

  } catch (erro) {
    console.log("Erro:", erro);
  }
}

mostrarQuantidade();