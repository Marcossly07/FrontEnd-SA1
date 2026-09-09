const dadosSalvos = localStorage.getItem("dadosDoAluno");
const objetoFinal = JSON.parse(dadosSalvos);
console.log(objetoFinal.length);

let total_cadastrados=document.getElementById("total_cadastrados");
total_cadastrados.textContent=objetoFinal.length;

let alerta_estoque=document.getElementById("alerta_estoque");
let quantidade_estoque=0;
for (let i=0;i<objetoFinal.length;i++){
    if (objetoFinal[i].Quantidade==1){
        quantidade_estoque+=1;
    }
}
alerta_estoque.textContent=quantidade_estoque;