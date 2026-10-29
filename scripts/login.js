function alternarVisibilidade() {
    const campoSenha = document.getElementById('senha');

    if (campoSenha.type === 'password') {
        campoSenha.type = 'text';
    } else {
        campoSenha.type = 'password';
    }
}

const nome = document.getElementById("nome");
const senha = document.getElementById('senha');

