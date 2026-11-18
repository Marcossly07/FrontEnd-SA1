const usuarioCorreto = "Overlord";
const usuarioTeste = "Usuario_teste";
const senhaCorreta = "Planefutu";

const formulario = document.querySelector(".login-form");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const usuario = document.querySelector("#usuario").value;
    const senha = document.querySelector("#senha").value;

    if (usuario === usuarioCorreto || usuario === usuarioTeste && senha === senhaCorreta) {

        alert("Login realizado com sucesso!");

        window.location.href = "/index.html";

    } else {

        alert("Usuário ou senha incorretos!");

    }

});