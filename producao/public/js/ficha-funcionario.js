import { preencherTabelaFuncionario, calcularResumoFuncionario, preencherDropdownFuncionarios } from "./ui.js";
import { capturarFiltrosFuncionario } from "./filtros.js";
import { carregarDadosFuncionarioBackend, carregarNomesFuncionariosBackend } from "./dados.js";
import { inicializarCalendario } from "./calendario.js";

let dadosAtuais = null;

// Carregar os nomes dos funcionários ao carregar a página
window.onload = async () => {
    console.log("[INFO] Página carregada. Iniciando carregamento dos nomes dos funcionários...");

    try {
        const nomes = await carregarNomesFuncionariosBackend();
        console.log("[INFO] Nomes dos funcionários carregados com sucesso:", nomes);

        preencherDropdownFuncionarios(nomes);
        console.log("[INFO] Dropdown preenchido com os nomes dos funcionários.");
    } catch (error) {
        console.error("[ERRO] Falha ao carregar os nomes dos funcionários:", error);
    }
};

// Evento para buscar os dados do funcionário selecionado
document.getElementById("buscarDados").addEventListener("click", async () => {
    console.log("[INFO] Botão 'Buscar Dados' clicado. Capturando filtros...");

    const filtros = capturarFiltrosFuncionario();
    if (!filtros) {
        console.warn("[AVISO] Filtros inválidos. A busca foi cancelada.");
        return;
    }

    console.log("[INFO] Filtros capturados:", filtros);

    try {
        const dados = await carregarDadosFuncionarioBackend(filtros.funcionario, filtros.dataInicio, filtros.dataFim);
        console.log("[INFO] Dados do funcionário carregados com sucesso:", dados);

        dadosAtuais = dados;
        
        preencherTabelaFuncionario(dados);
        console.log("[INFO] Tabela preenchida com os dados do funcionário.");

        calcularResumoFuncionario(dados.registros);
        console.log("[INFO] Resumo calculado e exibido com sucesso.");

        // Inicializar o calendário com os registros carregados
        inicializarCalendario(dados.registros);
        console.log("[INFO] Calendário inicializado com sucesso.");
    } catch (error) {
        console.error("[ERRO] Falha ao carregar os dados do funcionário:", error);
    }
});