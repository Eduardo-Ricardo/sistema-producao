const express = require("express");
const router = express.Router();

// Exemplo de rota para o módulo Produção
router.get("/", (req, res) => {
    res.send("Bem-vindo ao módulo Produção!");
});

module.exports = router;


/**
// Inicializa os arrays de entradas e saídas
let entradas = [];
let saidas = [];

// Referências aos elementos do DOM
const listaEntradas = document.getElementById("listaEntradas");
const listaSaidas = document.getElementById("listaSaidas");
const formCaixa = document.getElementById("formCaixa");

// Função para renderizar os registros
function renderizarRegistros() {
    console.log("[LOG] Renderizando registros...");

    // Limpa as listas
    listaEntradas.innerHTML = "";
    listaSaidas.innerHTML = "";

    // Renderiza as entradas
    for (let i = entradas.length - 1; i >= 0; i--) {
        const item = document.createElement("li");
        item.innerHTML = `<span>${entradas[i].descricao}</span><span>R$ ${entradas[i].valor.toFixed(2)}</span>`;
        listaEntradas.appendChild(item);
    }

    // Renderiza as saídas
    for (let i = saidas.length - 1; i >= 0; i--) {
        const item = document.createElement("li");
        item.innerHTML = `<span>${saidas[i].descricao}</span><span>R$ ${saidas[i].valor.toFixed(2)}</span>`;
        listaSaidas.appendChild(item);
    }

    console.log("[LOG] Registros renderizados com sucesso.");
}

// Evento de submissão do formulário
formCaixa.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log("[LOG] Submissão do formulário capturada.");

    // Captura os valores do formulário
    const tipo = document.getElementById("tipo").value;
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);

    console.log("[LOG] Dados capturados:", { tipo, descricao, valor });

    if (isNaN(valor) || valor <= 0) {
        console.warn("[AVISO] Valor inválido inserido.");
        alert("Por favor, insira um valor válido.");
        return;
    }

    // Adiciona o registro à lista correspondente
    if (tipo === "entrada") {
        entradas.push({ descricao, valor });
        console.log("[LOG] Entrada adicionada:", { descricao, valor });
    } else {
        saidas.push({ descricao, valor });
        console.log("[LOG] Saída adicionada:", { descricao, valor });
    }

    // Renderiza os registros atualizados
    renderizarRegistros();

    // Limpa os campos do formulário
    formCaixa.reset();
    console.log("[LOG] Formulário resetado.");
});
* */
