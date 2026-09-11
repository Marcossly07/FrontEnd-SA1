const dadosSalvos = localStorage.getItem("estoque");
const objetoFinal = JSON.parse(dadosSalvos);
let contador=Number(0);
let alerta=Number(0);


let total_cadastrados=document.getElementById("total_cadastrados");
Object.keys(objetoFinal).forEach(chave=>{
    Object.keys(objetoFinal[chave]).forEach(classe=>{
        contador+=1;
        if (objetoFinal[chave][classe]["Quantidade"]<2){
            console.log("CHEGUEI AQUI");
            alerta+=1;
        }
    })
})
total_cadastrados.textContent=contador;

let alerta_estoque=document.getElementById("alerta_estoque");

alerta_estoque.textContent=alerta;


