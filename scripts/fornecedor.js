
const form = document.getElementById("forms");
const btnConfirm = document.getElementById("btn-confirm");
const btnFiltro = document.getElementById("btn-filtro");
const tbody = document.getElementById("body-table");
const divRow = document.getElementById("row");
const rowFiltro = document.getElementById("row-filtro");

const API_URL = "https://6ab95468f84897980b728b5b.mockapi.io/api/fornecedor";

let idEmEdicao = null;
let existente = false;
let fornecedores = [];

const btnCancelar = document.createElement("button");
btnCancelar.textContent = "Cancelar";
btnCancelar.type = "button";
btnCancelar.style.backgroundColor = "#ED2100";

btnCancelar.style.border = "solid 1px black"
btnCancelar.style.color = "black";
btnCancelar.style.width = "100px";
btnCancelar.style.display = "none";

// ==========================================
// 1. FUNÇÕES AUXILIARES
// ==========================================

function limparNumeros(valor) {
    return valor.replace(/\D/g, "");
}



function validarCamposCnpjTel() {

    const cnpj = document.getElementById("cnpj").value;
    const telefone = document.getElementById("telefone").value;

    const cnpjNumeros = cnpj.replace(/\D/g, "");
    const telNumeros = telefone.replace(/\D/g, "");

    const cnpjRepetido = /^(\d)\1+$/.test(cnpjNumeros);

    console.log("CNPJ:", cnpjNumeros);
    console.log("Quantidade:", cnpjNumeros.length);
    console.log("É repetido?", cnpjRepetido);

    if (cnpjNumeros.length !== 14) {
        alert("CNPJ precisa ter 14 números.");
        return false;
    }

    if (cnpjRepetido) {
        alert("CNPJ não pode ter todos os números iguais.");
        return false;
    }

    if (telNumeros.length < 10 || telNumeros.length > 11) {
        alert("Telefone inválido ou incompleto!");
        return false;
    }

    if (/^(\d)\1+$/.test(telNumeros)) {
        alert("Telefone não pode ter números repetidos.");
        return false;
    }

    return true;
}

// ==========================================
// 2. VERIFICAR FORNECEDORES EXISTENTES
// ==========================================

async function listarFornecedor(nomeFornecedor = "") {
    const url = nomeFornecedor
        ? `${API_URL}?nome=${encodeURIComponent(nomeFornecedor)}`
        : API_URL;

    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    return await resposta.json();
}

async function verificarFornecedor() {
    const nome = document.getElementById("nome").value.trim();
    const cnpj = limparNumeros(
        document.getElementById("cnpj").value
    );

    try {
        fornecedores = await listarFornecedor();

        existente = fornecedores.some(i => {
            // Durante a edição, ignora o próprio fornecedor
            if (idEmEdicao && String(i.id) === String(idEmEdicao)) {
                return false;
            }

            const nomeBanco = i.nome.trim().toLowerCase();
            const cnpjBancoLimpo = limparNumeros(i.cnpj);

            return (
                (nome && nomeBanco === nome.toLowerCase()) ||
                (cnpj && cnpjBancoLimpo === cnpj)
            );
        });

    } catch (erro) {
        console.error("Erro ao verificar fornecedor:", erro);
        existente = false;
    }
}

// Verifica duplicidade quando os campos são alterados
form.addEventListener("input", () => {
    verificarFornecedor();
});

// ==========================================
// 3. LISTAR E EXIBIR FORNECEDORES
// ==========================================

function tratarFornecedores(lista) {
    tbody.innerHTML = "";

    lista.forEach(fornecedor => {

        const novaLinha = document.createElement("tr");

        const tdNome = document.createElement("td");
        tdNome.textContent = fornecedor.nome;

        const tdCnpj = document.createElement("td");
        tdCnpj.textContent = fornecedor.cnpj;

        const tdTelefone = document.createElement("td");
        tdTelefone.textContent = fornecedor.telefone;

        const tdEmail = document.createElement("td");
        tdEmail.textContent = fornecedor.email;

        const tdAcoes = document.createElement("td");

        // BOTÃO EDITAR
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.type = "button";
        btnEditar.style.marginRight = "5px";
        btnEditar.style.marginLeft = "20px";
        btnEditar.style.width = "55px";
        btnEditar.style.backgroundColor = "#FFDE21";

        btnEditar.addEventListener("click", () => {
            editarFornecedor(fornecedor);
        });

        // BOTÃO EXCLUIR
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.type = "button";
        btnExcluir.style.width = "55px";
        btnExcluir.style.backgroundColor = "#ED2100";

        btnExcluir.addEventListener("click", () => {
            excluirFornecedor(fornecedor.id, fornecedor.nome);
        });

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);

        novaLinha.appendChild(tdNome);
        novaLinha.appendChild(tdCnpj);
        novaLinha.appendChild(tdTelefone);
        novaLinha.appendChild(tdEmail);
        novaLinha.appendChild(tdAcoes);

        tbody.appendChild(novaLinha);
    });
}

// ==========================================
// 4. EDITAR FORNECEDOR
// ==========================================

function editarFornecedor(fornecedor) {

    idEmEdicao = fornecedor.id;

    document.getElementById("titulo").textContent =
        "Edição do Fornecedor";

    btnConfirm.textContent = "Salvar";

    document.getElementById("nome").value = fornecedor.nome;
    document.getElementById("cnpj").value = fornecedor.cnpj;
    document.getElementById("telefone").value = fornecedor.telefone;
    document.getElementById("email").value = fornecedor.email;

    divRow.appendChild(btnCancelar);
    btnCancelar.style.display = "inline-block";

    verificarFornecedor();
}

// ==========================================
// 5. CANCELAR EDIÇÃO
// ==========================================

function cancelarEdicao() {

    idEmEdicao = null;
    existente = false;

    form.reset();

    document.getElementById("titulo").textContent =
        "Cadastro do Fornecedor";

    btnConfirm.textContent = "Cadastrar";

    btnCancelar.style.display = "none";
}

btnCancelar.addEventListener("click", cancelarEdicao);

// ==========================================
// 6. EXCLUIR FORNECEDOR
// ==========================================

async function excluirFornecedor(id, nome) {

    if (!confirm(`Excluir fornecedor ${nome}?`)) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        alert("Fornecedor excluído com sucesso!");

        const lista = await listarFornecedor();
        tratarFornecedores(lista);

    } catch (erro) {
        console.error("Não foi possível excluir o fornecedor:", erro);
        alert("Erro ao excluir fornecedor.");
    }
}

// ==========================================
// 7. CADASTRAR E ATUALIZAR FORNECEDOR
// ==========================================

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Primeiro valida CNPJ e telefone
    if (!validarCamposCnpjTel()) {
        return;
    }

    const nome = document.getElementById("nome").value.trim();
    const cnpj = document.getElementById("cnpj").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value.trim();

    if (!nome) {
        alert("Informe o nome do fornecedor.");
        return;
    }

    // Atualiza a verificação antes de salvar
    await verificarFornecedor();

    if (!idEmEdicao && existente) {
        alert("Fornecedor já existente, altere o nome ou o CNPJ.");
        return;
    }

    const fornecedor = {
        nome,
        cnpj,
        telefone,
        email
    };

    try {
        const url = idEmEdicao
            ? `${API_URL}/${idEmEdicao}`
            : API_URL;

        const metodo = idEmEdicao ? "PUT" : "POST";

        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fornecedor)
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        alert(
            idEmEdicao
                ? "Fornecedor atualizado com sucesso!"
                : "Fornecedor cadastrado com sucesso!"
        );

        window.location.reload();

    } catch (erro) {
        console.error("Não foi possível salvar o fornecedor:", erro);
        alert("Erro ao salvar fornecedor.");
    }
});

// ==========================================
// 8. FILTRAR FORNECEDORES
// ==========================================

btnFiltro.addEventListener("click", async (event) => {

    event.preventDefault();

    const filtro = document.getElementById("filtro").value.trim();

    try {
        const lista = await listarFornecedor(filtro);

        tratarFornecedores(lista);

        if (filtro) {
            if (!rowFiltro.contains(btnCancelar)) {
                rowFiltro.appendChild(btnCancelar);
            }

            btnCancelar.style.display = "inline-block";
        }

    } catch (erro) {
        console.error("Erro ao filtrar:", erro);
    }
});

// ==========================================
// 9. MÁSCARA DE CNPJ E TELEFONE
// ==========================================

const inputs = document.querySelectorAll(".cnpj-tel");

inputs.forEach(input => {

    input.addEventListener("input", function() {

        const regexInvalidos = /[^0-9().\/+\-\s]/g;

        if (regexInvalidos.test(this.value)) {
            alert("Atenção: Apenas números são permitidos neste campo.");
        }

        let valor = limparNumeros(this.value);

        // MÁSCARA DE TELEFONE
        if (this.id === "telefone") {

            valor = valor.substring(0, 11);

            if (valor.length > 10) {
                valor = valor.replace(
                    /^(\d{2})(\d{5})(\d{4})/,
                    "($1) $2-$3"
                );

            } else if (valor.length > 6) {
                valor = valor.replace(
                    /^(\d{2})(\d{4})(\d{0,4})/,
                    "($1) $2-$3"
                );

            } else if (valor.length > 2) {
                valor = valor.replace(
                    /^(\d{2})(\d{0,5})/,
                    "($1) $2"
                );

            } else if (valor.length > 0) {
                valor = valor.replace(/^(\d*)/, "($1");
            }
        }

        // MÁSCARA DE CNPJ
        else if (this.id === "cnpj") {

    valor = valor.substring(0, 14);

    valor = valor.replace(
        /^(\d{2})(\d)/,
        "$1.$2"
    );

    valor = valor.replace(
        /^(\d{2})\.(\d{3})(\d)/,
        "$1.$2.$3"
    );

    valor = valor.replace(
        /^(\d{2})\.(\d{3})\.(\d{3})(\d)/,
        "$1.$2.$3/$4"
    );

    valor = valor.replace(
        /(\d{4})(\d{1,2})$/,
        "$1-$2"
    );
}

        this.value = valor;
    });
});

// ==========================================
// 10. CARREGAR FORNECEDORES AO INICIAR
// ==========================================

async function inicializar() {
    try {
        const lista = await listarFornecedor();
        fornecedores = lista;
        tratarFornecedores(lista);

    } catch (erro) {
        console.error("Erro ao carregar fornecedores:", erro);
    }
}

inicializar();
