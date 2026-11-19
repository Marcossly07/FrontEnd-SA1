let pastilhasDisponiveis = [];
let valorUnidade = 0;

const forms = document.getElementById("cadastro");

const selectFornecedor = document.getElementById("fornecedor");
const selectPastilha = document.getElementById("classe");

const paragrafoCadastrante = document.getElementById("paragrafo-cadastrante");
const paragrafoData = document.getElementById("paragrafo-data");
const paragrafoQuantidade = document.getElementById("paragrafo-quantidade");
const paragrafoValorUnidade =document.getElementById("paragrafo-valor-pacote");
const paragrafoValorTotal = document.getElementById("paragrafo-valor-total");
const paragrafoFornecedor = document.getElementById("paragrafo-fornecedor");
const paragrafoClasse = document.getElementById("paragrafo-classe");
const paragrafoTipo = document.getElementById("paragrafo-tipo");

// Formata os valores em reais
function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Busca fornecedores e pastilhas
async function fornecedoresEPastilhas() {
    try {
        const selectFornecedor = document.getElementById("fornecedor");
        const selectPastilha = document.getElementById("classe");

        // Busca fornecedores
        const respostaFornecedor = await fetch(
            "https://6ab95468f84897980b728b5b.mockapi.io/api/fornecedor"
        );

        if (!respostaFornecedor.ok) {
            throw new Error("Erro ao buscar fornecedores");
        }

        const objRespostaFornecedor = await respostaFornecedor.json();

        console.log("Fornecedores recebidos:", objRespostaFornecedor);

        // Busca pastilhas
        const respostaPastilha = await fetch(
            "https://6ab95468f84897980b728b5b.mockapi.io/api/pastilhas"
        );

        if (!respostaPastilha.ok) {
            throw new Error("Erro ao buscar pastilhas");
        }

        pastilhasDisponiveis = await respostaPastilha.json();

        console.log("Pastilhas recebidas:", pastilhasDisponiveis);

        // Limpa e preenche fornecedores
        selectFornecedor.replaceChildren(
            new Option("Selecione", "")
        );

        for (const fornecedor of objRespostaFornecedor) {
            console.log("Fornecedor:", fornecedor.nome);

            selectFornecedor.add(
                new Option(fornecedor.nome, fornecedor.nome)
            );
        }

        // Limpa classes
        selectPastilha.replaceChildren(
            new Option("Selecione", "")
        );

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        alert("Erro ao carregar fornecedores. Verifique o console.");
    }
}


// Atualiza as classes conforme o fornecedor
selectFornecedor.addEventListener("change", function () {
    const fornecedorSelecionado = selectFornecedor.value;

    selectPastilha.replaceChildren(new Option("Selecione", ""));

    const classes = pastilhasDisponiveis
        .filter(pastilha =>
            pastilha.fornecedor === fornecedorSelecionado
        )
        .map(pastilha => pastilha.classe);

    for (const classe of new Set(classes)) {
        selectPastilha.add(new Option(classe, classe));
    }

    // Limpa o preço anterior
    valorUnidade = 0;
    atualizarResumo();
});

// Atualiza o preço ao selecionar uma classe
selectPastilha.addEventListener("change", atualizarValor);

// Atualiza os dados exibidos no formulário
function atualizarResumo() {
    const dataAtual = new Date();

    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth() + 1;
    const dia = dataAtual.getDate();

    const cadastrante = document.getElementById("cadastrante").value;
    const quantidade = document.getElementById("quantidade").value;
    const fornecedor = selectFornecedor.value;
    const classe = selectPastilha.value;
    const tipo = document.getElementById("tipo").value;

    const quantidadeNumerica = Number(quantidade) || 0;

    const valorTotal = quantidadeNumerica * valorUnidade;

    paragrafoCadastrante.textContent = `Cadastrante: ${cadastrante}`;
    paragrafoData.textContent = `Data: ${dia}/${mes}/${ano}`;

    paragrafoQuantidade.textContent =
        `Quantidade: ${quantidade} und (pacote)`;

    paragrafoValorUnidade.textContent =
        `Valor da unidade: ${formatarMoeda(valorUnidade)}`;
    paragrafoValorTotal.textContent =
        `Valor total: ${formatarMoeda(valorTotal)}`;

    paragrafoFornecedor.textContent = `Fornecedor: ${fornecedor}`;
    paragrafoClasse.textContent = `Classe: ${classe}`;
    paragrafoTipo.textContent = `Tipo: ${tipo}`;

    document.getElementById("titulo").textContent =
        tipo === "Retirada" ? "Cadastro de Retirada" : "Cadastro";
}

// Input e change atualizam o resumo
forms.addEventListener("input", atualizarResumo);
forms.addEventListener("change", atualizarResumo);

// Carrega os dados iniciais
fornecedoresEPastilhas();

// Envio do formulário
forms.addEventListener("submit", async function (event) {
    event.preventDefault();

    const quantidade = Number(
        document.getElementById("quantidade").value
    );

    const fornecedor = selectFornecedor.value;
    const classe = selectPastilha.value;
    const tipo = document.getElementById("tipo").value;
    const cadastrante = document.getElementById("cadastrante").value;

    // Validações
    if (!fornecedor || !classe || !tipo || !cadastrante || !quantidade || quantidade <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    if (valorUnidade <= 0 || !Number.isFinite(valorUnidade)) {
        alert("Selecione uma pastilha com preço válido!");
        return;
    }

    const pastilha_cadastrada = {
        fornecedor: fornecedor,
        classe: classe,
        quantidade: quantidade,
        cadastrante: cadastrante,
        retirada: "não",
        hora: new Date(),
        valorUnidade: valorUnidade
    };

    const url =
        "https://6abae78c5b549d818d62b557.mockapi.io/api/v1/entradas-e-saidas";

    try {
        const resposta = await fetch(url);
        const pastilhas = await resposta.json();

        // Procura o estoque correspondente
        const cadastroExistente = pastilhas.find(cadastro =>
            cadastro.fornecedor === fornecedor &&
            cadastro.classe === classe &&
            cadastro.retirada !== "sim"
        );

        if (tipo === "Cadastro") {

            if (cadastroExistente) {

                // Soma a quantidade ao estoque existente
                const novaQuantidade =
                    Number(cadastroExistente.quantidade) + quantidade;
                const novoValor= Number(cadastroExistente.quantidade)

                const respostaAtualizacao = await fetch(
                    `${url}/${cadastroExistente.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            ...cadastroExistente,
                            quantidade: novaQuantidade,
                            cadastrante: cadastrante,
                            hora: new Date()
                        })
                    }
                );

                if (!respostaAtualizacao.ok) {
                    throw new Error("Erro ao atualizar o estoque.");
                }

            } else {

                // Cadastra uma nova pastilha
                const respostaCadastro = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(pastilha_cadastrada)
                });

                if (!respostaCadastro.ok) {
                    throw new Error("Erro ao cadastrar a pastilha.");
                }
            }

            forms.reset();
            valorUnidade = 0;
            atualizarResumo();

            // Limpa a classe selecionada
            selectPastilha.replaceChildren(new Option("Selecione", ""));

            alert("Pastilha cadastrada com sucesso!");

        } else if (tipo === "Retirada") {

            if (!cadastroExistente) {
                alert("Não existe estoque dessa pastilha!");
                return;
            }

            const estoqueAtual = Number(cadastroExistente.quantidade);

            if (quantidade > estoqueAtual) {
                alert("O número de retirada é maior que o estoque!");
                return;
            }
            if (quantidade == estoqueAtual) {

    // Registra a retirada no histórico
    const registroRetirada = {
        ...pastilha_cadastrada,
        retirada: "sim"
    };

    const respostaRetirada = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registroRetirada)
    });

    if (!respostaRetirada.ok) {
        throw new Error("Erro ao registrar a retirada.");
    }

    // Depois de salvar no histórico, exclui o estoque
    const respostaDelete = await fetch(
        `${url}/${cadastroExistente.id}`,
        {
            method: "DELETE"
        }
    );

    if (!respostaDelete.ok) {
        throw new Error("Erro ao excluir a pastilha do estoque.");
    }

    alert("Pastilha retirada com sucesso!");
    location.reload();

    return;
}
            const novoEstoque = estoqueAtual - quantidade;

            // Atualiza o estoque
            const respostaAtualizacao = await fetch(
                `${url}/${cadastroExistente.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...cadastroExistente,
                        quantidade: novoEstoque
                    })
                }
            );

            if (!respostaAtualizacao.ok) {
                throw new Error("Erro ao atualizar o estoque.");
            }

            // Registra a retirada separadamente
            const registroRetirada = {
                ...pastilha_cadastrada,
                retirada: "sim"
            };

            const respostaRetirada = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registroRetirada)
            });

            if (!respostaRetirada.ok) {
                throw new Error("Erro ao registrar a retirada.");
            }

            forms.reset();
            valorUnidade = 0;
            atualizarResumo();

            selectPastilha.replaceChildren(new Option("Selecione", ""));

            alert("Pastilha retirada com sucesso!");

        } else {
            alert("Tipo de operação inválido!");
        }

    } catch (erro) {
        console.error("Erro ao processar operação:", erro);
        alert("Ocorreu um erro ao processar a operação.");
    }
});

function atualizarValor() {
    const fornecedorSelecionado = selectFornecedor.value;
    const classeSelecionada = selectPastilha.value;

    const pastilhaSelecionada = pastilhasDisponiveis.find(pastilha =>
        pastilha.fornecedor === fornecedorSelecionado &&
        pastilha.classe === classeSelecionada
    );

    if (pastilhaSelecionada) {
        valorUnidade = Number(pastilhaSelecionada.preco);
    } else {
        valorUnidade = 0;
    }

    atualizarResumo();
}