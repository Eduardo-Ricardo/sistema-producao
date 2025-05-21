import { preencherTabelaFuncionario, calcularResumoFuncionario, preencherDropdownFuncionarios } from "./ui.js";
import { capturarFiltrosFuncionario } from "./filtros.js";
import { carregarDadosFuncionarioBackend, carregarNomesFuncionariosBackend } from "./dados.js";
import { inicializarCalendario } from "./calendario.js";

let dadosAtuais = null;

/**
 * Função para carregar os nomes dos funcionários ao carregar a página
 * @returns {Promise<void>}
 */
async function carregarNomesFuncionarios() {
    btnBuscar.disabled = true;
    selectPessoa.disabled = true;
    try {
        const nomes = await carregarNomesFuncionariosBackend();
        preencherDropdownFuncionarios(nomes);
        selectPessoa.disabled = false;
    } catch (error) {
        alert("Erro ao carregar nomes dos funcionários. Tente recarregar a página.");
    } finally {
        btnBuscar.disabled = false;
    }
}

/**
 * Evento para buscar os dados do funcionário selecionado
 * @returns {Promise<void>}
 */
btnBuscar.addEventListener("click", async () => {
    // Validação extra de datas
    const dataInicio = dataInicioInput.value;
    const dataFim = dataFimInput.value;
    if (dataInicio && dataFim && dataInicio > dataFim) {
        alert("A data de início não pode ser maior que a data de fim.");
        return;
    }
    btnBuscar.disabled = true;
    const filtros = capturarFiltrosFuncionario();
    if (!filtros) {
        btnBuscar.disabled = false;
        return;
    }
    try {
        const dados = await carregarDadosFuncionarioBackend(filtros.funcionario, filtros.dataInicio, filtros.dataFim);
        dadosAtuais = dados;
        preencherTabelaFuncionario(dados);
        calcularResumoFuncionario(dados.registros);
        inicializarCalendario(dados.registros);
    } catch (error) {
        alert("Erro ao buscar dados do funcionário.");
    } finally {
        btnBuscar.disabled = false;
    }
});

// Carregar os nomes dos funcionários ao carregar a página
window.onload = carregarNomesFuncionarios;