let produtos_cadastrados=[{id:"43",nome:"hilquias",classe:"Classe K",quantidade:"1",preco:"1454"},{id:"43",nome:"hilquias",classe:"Classe K",quantidade:"1",preco:"1454"},{id:"43",nome:"hilquias",classe:"Classe K",quantidade:"1",preco:"1454"},{id:"43",nome:"hilquias",classe:"Classe K",quantidade:"134",preco:"1454"},{id:"43",nome:"hilquias",classe:"Classe K",quantidade:"1",preco:"1454"},];
const tbody=document.getElementById("minha-tabela-filtro");
let linhas="";
let formulario=document.getElementById("form-id");
formulario.addEventListener('submit',function(event){
    event.preventDefault();
    const inputid=document.getElementById("input-id").value;
    for (let i=0;i<produtos_cadastrados.length;i++){
    console.log(inputid)
    if (produtos_cadastrados[i].classe==inputid){
        if (produtos_cadastrados[i].quantidade<2){
            linhas+=`
            <tr class="pouca_quantidade">
                <td>${produtos_cadastrados[i].id}</td>
                <td>${produtos_cadastrados[i].classe}</td>
                <td>${produtos_cadastrados[i].quantidade}</td>
                <td>R$${produtos_cadastrados[i].preco}</td>
                <td><button>Solicitar</button></td>
            </tr>
    `;}else{
            linhas+=`
            <tr>
                <td>${produtos_cadastrados[i].id}</td>
                <td>${produtos_cadastrados[i].classe}</td>
                <td>${produtos_cadastrados[i].quantidade}</td>
                <td>R$${produtos_cadastrados[i].preco}</td>
                <td><button>Nota Fiscal</button></td>
            </tr>
    `};
    tbody.innerHTML=linhas;
}}

})

const tbodyEntradas= document.getElementById("tabela-entradas");
let linhas_entradas="";
for(let i=0;i<produtos_cadastrados.length;i++){
    if (produtos_cadastrados[i].quantidade<2){
            linhas_entradas+=`
            <tr class="pouca_quantidade">
                <td>${produtos_cadastrados[i].id}</td>
                <td>${produtos_cadastrados[i].classe}</td>
                <td>${produtos_cadastrados[i].quantidade}</td>
                <td>R$${produtos_cadastrados[i].preco}</td>
                <td><button>Solicitar</button></td>
            </tr>
    `;}else{
            linhas_entradas+=`
            <tr>
                <td>${produtos_cadastrados[i].id}</td>
                <td>${produtos_cadastrados[i].classe}</td>
                <td>${produtos_cadastrados[i].quantidade}</td>
                <td>R$${produtos_cadastrados[i].preco}</td>
                <td><button>Imprimir</button></td>
            </tr>
    `};
    tbodyEntradas.innerHTML=linhas_entradas;
}
