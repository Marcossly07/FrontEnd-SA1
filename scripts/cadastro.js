const forms = document.getElementById("cadastro");
const paragrafoCadastrante = document.getElementById("paragrafo-cadastrante")
const paragrafoData = document.getElementById("paragrafo-data")
const paragrafoQuantidade = document.getElementById("paragrafo-quantidade")
const paragrafoValorUnidade = document.getElementById("paragrafo-valor-unidade")
const paragrafoValorPacote = document.getElementById("paragrafo-valor-pacote")
const paragrafoValorTotal = document.getElementById("paragrafo-valor-total")
const paragrafoFornecedor = document.getElementById("paragrafo-fornecedor")
const paragrafoClasse = document.getElementById("paragrafo-classe")
const paragrafoTipo = document.getElementById("paragrafo-tipo")

let estoquePastilhas = JSON.parse(localStorage.getItem("dadosDoAluno")) || [];

forms.addEventListener("input", function (){
    const dataAtual = new Date()
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth() + 1; // Soma 1 porque começa do zero
    const dia = dataAtual.getDate();
    const cadastrante = document.getElementById("cadastrante").value;
    const quantidade = document.getElementById("quantidade").value;
    const fornecedor = document.getElementById("fornecedor").value;
    const classe = document.getElementById("classe").value;
    const tipo = document.getElementById("tipo").value;

    const pacote = 90
    const quantidadeText = quantidade
    const quantidadeNumr = Number(quantidadeText)
    let valorTotal = 0

    for(let i = 0; i < quantidadeNumr; i++){
        valorTotal += pacote
    }

    paragrafoCadastrante.textContent = `Cadastrante: ${cadastrante}`;
    paragrafoData.textContent = `Data: ${dia}/${mes}/${ano}`
    paragrafoQuantidade.textContent = `Quantidade: ${quantidade}und (pacote)`
    paragrafoValorUnidade.textContent = `Valor por unidade: R$9,00`
    paragrafoValorPacote.textContent = `Valor por pacote: R$${pacote},00`
    paragrafoValorTotal.textContent = `Valor total: R$${valorTotal},00`
    paragrafoFornecedor.textContent = `Fornecedor: ${fornecedor}`
    paragrafoClasse.textContent = `Classe: ${classe}`
    paragrafoTipo.textContent = `Tipo: ${tipo}`
});


forms.addEventListener("submit", function(event){
    event.preventDefault();
    
    const cadastrante = document.getElementById("cadastrante").value;
    const senha = document.getElementById("senha").value;
    const quantidade = document.getElementById("quantidade").value;
    const fornecedor = document.getElementById("fornecedor").value;
    const classe = document.getElementById("classe").value;
    const tipo = document.getElementById("tipo").value;
    
    
    if(senha === "123" && cadastrante === "Jadson"){
        let folhaCadastro = {}
        folhaCadastro["Id"] = estoquePastilhas.length ;
        folhaCadastro["Cadastrante"] = cadastrante;
        folhaCadastro["Quantidade"] = quantidade;
        folhaCadastro["Fornecedor"] = fornecedor;
        folhaCadastro["Classe"] = classe;
        folhaCadastro["Tipo"] = tipo;
        estoquePastilhas.push(folhaCadastro);
        console.log("Senha certa");
        localStorage.setItem("dadosDoAluno", JSON.stringify(estoquePastilhas));
        alert("Cadastro realizado com sucesso.")
    }
    
    else{
        alert("Cadastrante ou senha errado!");
        console.log("Senha errada");
    }
    console.log(estoquePastilhas);
});
