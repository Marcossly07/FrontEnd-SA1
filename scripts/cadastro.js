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



let estoquePastilhas = JSON.parse(localStorage.getItem("estoque")) || {};
let historicoRetiradas=JSON.parse(localStorage.getItem("retiradas"))||[];
let contador=JSON.parse(localStorage.getItem("contador"))||[];

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
        if (contador.length==0){
            contador.push(Number(0));
        }
        if(tipo=="Cadastro"){
            if(!estoquePastilhas[fornecedor]){
                estoquePastilhas[fornecedor]={};
            }
            if(estoquePastilhas[fornecedor][classe]){
                let quantidadeAtual=Number(estoquePastilhas[fornecedor][classe]["Quantidade"]) || 0;
                estoquePastilhas[fornecedor][classe]["Quantidade"]=quantidadeAtual+Number(quantidade);
                contador[0]=Number(contador[0])+Number(1);
            }
            else{
                contador[0]=Number(contador[0])+Number(1);
                estoquePastilhas[fornecedor][classe]={};
                estoquePastilhas[fornecedor][classe]["Id"]=contador[0];
                estoquePastilhas[fornecedor][classe]["Quantidade"]=quantidade;
            }
            localStorage.setItem("estoque", JSON.stringify(estoquePastilhas));
            localStorage.setItem("contador", JSON.stringify(contador));
                        if (quantidade==1){
                    alert("POUCA QUANTIDADE!");
                }
            alert("Pastilha cadastrada com sucesso!");
        }
        else{
            if(!estoquePastilhas[fornecedor]?.[classe]){
                alert("Nenhuma pastilha foi cadastrada com essas informações.");
            }
            else if(!estoquePastilhas[fornecedor][classe]){
                alert("A classe solicitada não foi cadastrada para essa fornecedor.");
            }
            else{
                let estoqueQuantidade=Number(estoquePastilhas[fornecedor][classe]["Quantidade"])
                let retirada=Number(quantidade)
                if(estoqueQuantidade<retirada){
                    alert("O número para retirada é maior que o estoque.");
                }
                else{
                    retiradaObj={"Id":(historicoRetiradas.length)+1,"Fornecedor":fornecedor,"Classe":classe,"Quantidade":retirada};
                    estoquePastilhas[fornecedor][classe]["Quantidade"]=estoqueQuantidade-retirada;
                    historicoRetiradas.push(retiradaObj);
                    if (estoquePastilhas[fornecedor][classe]["Quantidade"]==0){
                        delete estoquePastilhas[fornecedor][classe];
                    }
                    else if(estoquePastilhas[fornecedor][classe]["Quantidade"]==1){
                        alert("POUCA QUANTIDADE!");
                    }
                    localStorage.setItem("estoque", JSON.stringify(estoquePastilhas));
                    localStorage.setItem("retiradas", JSON.stringify(historicoRetiradas));
                    alert("Operação concluída!")
                }
            }
        }
    }
    console.log(estoquePastilhas);
    
});

console.log(contador);