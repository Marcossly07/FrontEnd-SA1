const forms = document.getElementById("cadastro");
let estoquePastilhas = []
let confirmarSenha = false


forms.addEventListener("submit", function(event){
    event.preventDefault();
    
    const cadastrante = document.getElementById("cadastrante").value;
    const senha = document.getElementById("senha").value;
    const quantidade = document.getElementById("quantidade").value;
    const fornecedor = document.getElementById("fornecedor").value;
    const classe = document.getElementById("classe").value;
    const solicitacao = document.getElementById("solicitacao").value;

    
    if(senha === "123" && cadastrante === "Jadson"){
        let folhaCadastro = {}
        folhaCadastro["Id"] = estoquePastilhas.length ;
        folhaCadastro["Cadastrante"] = cadastrante;
        folhaCadastro["Quantidade"] = quantidade;
        folhaCadastro["Fornecedor"] = fornecedor;
        folhaCadastro["Classe"] = classe;
        folhaCadastro["Solicitação"] = solicitacao;
        estoquePastilhas.push(folhaCadastro);
        console.log("Senha certa");
        localStorage.setItem("dadosDoAluno", JSON.stringify(estoquePastilhas));
    }
    else{
        alert("Cadastrante ou senha errado!");
        console.log("Senha errada");
    }
    console.log(estoquePastilhas);
});
