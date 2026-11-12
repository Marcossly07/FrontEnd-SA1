const form = document.getElementById("forms");
const btnConfirm = document.getElementById("btn-confirm");
const btnFiltro = document.getElementById("btn-filtro");
const tbody = document.getElementById("body-table");
const selectFornecedor = document.getElementById("fornecedor");

const API_URL = "https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas";
const API_FORNECEDOR = "https://6ab95468f84897980b728b5b.mockapi.io/api/fornecedor";

let idEmEdicao = null; // null = modo cadastro | valor = modo edição
let listaAtual = [];   // últimas pastilhas carregadas (usada para checar duplicidade)

// Um único botão Cancelar, reutilizado no filtro e na edição
const btnCancelar = document.createElement("button");
btnCancelar.type = "button";
btnCancelar.textContent = "Cancelar";
btnCancelar.style.width = "100px";
btnCancelar.style.backgroundColor = "#ED2100";
btnCancelar.addEventListener("click", () => {
    window.location.reload();
});

// ---------- Fornecedores (preenche o select) ----------

async function carregarFornecedores() {
    selectFornecedor.innerHTML = "";
    try {
        const resposta = await fetch(API_FORNECEDOR);
        if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);
        const fornecedores = await resposta.json();

        selectFornecedor.add(new Option("Selecione", ""));
        fornecedores.forEach(fornecedor => {
            selectFornecedor.add(new Option(fornecedor.nome, fornecedor.nome));
        });
    } catch (erro) {
        console.error("Erro ao carregar fornecedores:", erro);
        selectFornecedor.add(new Option("Erro ao carregar fornecedores", ""));
    }
}

// ---------- API de pastilhas ----------

async function listarPastilhas(idPastilha) {
    const url = idPastilha
        ? `${API_URL}?idPastilha=${encodeURIComponent(idPastilha)}`
        : API_URL;
    const resposta = await fetch(url);

    if (!resposta.ok) {
        // O MockAPI responde 404 quando o filtro não encontra nada
        if (resposta.status === 404) return [];
        throw new Error(`Erro: ${resposta.status}`);
    }
    return await resposta.json();
}

async function excluirPastilha(id, linha) {
    console.log(`${API_URL}/${id}`)
    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        linha.remove(); // só remove da tela se o servidor confirmou
    } catch (erro) {
        console.error("Não foi possível excluir a pastilha:", erro);
        alert("Não foi possível excluir a pastilha.");
    }
}

async function salvarPastilha(pastilha) {
    try {
        const url = idEmEdicao ? `${API_URL}/${idEmEdicao}` : API_URL;
        const metodo = idEmEdicao ? "PUT" : "POST";
        const resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pastilha)
        });
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
    } catch (erro) {
        console.error("Não foi possível salvar a pastilha:", erro);
        alert("Não foi possível salvar a pastilha.");
        return;
    }

    // Atualiza a página automaticamente
    window.location.reload();
}

// ---------- Tela ----------

function tratarPastilhas(lista) {
    listaAtual = lista;
    tbody.innerHTML = "";

    const divRow = btnConfirm.parentElement; // linha do botão Adicionar/Salvar

    lista.forEach(pastilha => {
        const novaLinha = document.createElement("tr");

        [pastilha.idPastilha || pastilha.id, pastilha.codigo, pastilha.classe, pastilha.fornecedor, pastilha.quantidade].forEach(valor => {
            const td = document.createElement("td");
            td.textContent = valor ?? "";
            novaLinha.appendChild(td);
        });

        const tdAcoes = document.createElement("td");

        // Botão Editar
        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.textContent = "Editar";
        btnEditar.style.marginRight = "5px";
        btnEditar.style.marginLeft = "20px";
        btnEditar.style.width = "55px";
        btnEditar.style.backgroundColor = "#FFDE21";

        btnEditar.addEventListener("click", (event) => {
            event.preventDefault();
            console.log(pastilha)

            idEmEdicao = pastilha.id; // guarda quem está sendo editado

            document.getElementById("titulo").textContent = "Edição da Pastilha";
            btnConfirm.textContent = "Salvar";

            // Mostra os dados da pastilha no formulário
            document.getElementById("id").value = pastilha.idPastilha;
            document.getElementById("codigo").value = pastilha.codigo;
            document.getElementById("classe").value = pastilha.classe;
            document.getElementById("quantidade").value = pastilha.quantidade;

            // Se o fornecedor não estiver mais na lista, adiciona para não perder o valor
            if (![...selectFornecedor.options].some(o => o.value === pastilha.fornecedor)) {
                selectFornecedor.add(new Option(pastilha.fornecedor, pastilha.fornecedor));
            }
            selectFornecedor.value = pastilha.fornecedor;

            divRow.appendChild(btnCancelar);
        });

        // Botão Excluir
        const btnExcluir = document.createElement("button");
        btnExcluir.type = "button";
        btnExcluir.textContent = "Excluir";
        btnExcluir.style.width = "55px";
        btnExcluir.style.backgroundColor = "#ED2100";

        btnExcluir.addEventListener("click", () => {
            if (!confirm(`Excluir a pastilha ${pastilha.codigo}?`)) return;
            excluirPastilha(pastilha.id, novaLinha);
            window.location.reload();
        });

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);
        novaLinha.appendChild(tdAcoes);

        tbody.appendChild(novaLinha);
    });
}

// ---------- Filtro ----------

btnFiltro.addEventListener("click", async (event) => {
    event.preventDefault();
    const rowFiltro = document.getElementById("row-filtro");
    const filtro = document.getElementById("filtro").value.trim();

    console.log(filtro)
    try {
        const lista = await listarPastilhas(filtro);
        tratarPastilhas(lista);
        console.log(lista)
        console.log(tratarPastilhas(lista))
    } catch (erro) {
        console.error("Erro ao filtrar:", erro);
    }

    if (filtro) {
        rowFiltro.appendChild(btnCancelar);
    }
});

// ---------- Cadastro / edição ----------

form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Na edição, se o campo ID ficar vazio, mantém o ID que a pastilha já tinha
    const pastilhaEmEdicao = listaAtual.find(p => p.id === idEmEdicao);
    const idPastilha = document.getElementById("id").value.trim()
        || (pastilhaEmEdicao && pastilhaEmEdicao.idPastilha) || "";
    const codigo = document.getElementById("codigo").value.trim().toUpperCase();
    const classe = document.getElementById("classe").value;
    const fornecedor = selectFornecedor.value;
    const quantidade = document.getElementById("quantidade").value;

    if (!fornecedor) {
        alert("Selecione um fornecedor.");
        return;
    }

    console.log(idPastilha)
    // Duplicada = mesmo código + mesmo fornecedor (ignora a própria pastilha em edição)
    const existente = listaAtual.some(pastilha =>
        pastilha.id !== idEmEdicao && String(pastilha.idPastilha).toUpperCase() === idPastilha.toUpperCase()
    );

    if (existente) {
        alert("Pastilha já existente, altere o ID interno ou código.");
        return;
    }

    salvarPastilha({ idPastilha, codigo, classe, fornecedor, quantidade });
});

// ---------- Início ----------

carregarFornecedores();
listarPastilhas().then(tratarPastilhas).catch(erro => {
    console.error("Erro ao carregar pastilhas:", erro);
});