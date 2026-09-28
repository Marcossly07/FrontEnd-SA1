const form = document.getElementById("forms");
const tbody = document.getElementById("body-table");

form.addEventListener("submit", function(event){
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const pastilha = document.getElementById("pastilha").value;
    const preco = document.getElementById("preco").value;
    const codigoFornecedor = document.getElementById("codigo-fornecedor").value; 

    const novaLinha = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = nome;

    const tdPastilha = document.createElement("td");
    tdPastilha.textContent = pastilha

    const tdPreco = document.createElement("td");
    tdPreco.textContent = preco

    const tdCodigoFornecedor = document.createElement("td");
    tdCodigoFornecedor.textContent = codigoFornecedor

    // Adiciona as células dentro da nova linha
    novaLinha.appendChild(tdNome);
    novaLinha.appendChild(tdPastilha);
    novaLinha.appendChild(tdPreco);
    novaLinha.appendChild(tdCodigoFornecedor);

    // Adiciona a linha diretamente no corpo da tabela em tempo real
    tbody.appendChild(novaLinha);

    form.reset();
});