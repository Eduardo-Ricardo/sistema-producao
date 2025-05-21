// Este arquivo só captura filtros do usuário (inputs do formulário).
// Não faz mais filtragem ou processamento de arrays de dados.

/**
 * Captura os valores dos filtros selecionados na página ficha-funcionario.html
 * @returns {Object|null} Um objeto contendo os filtros capturados (funcionario, dataInicio, dataFim) ou null se nenhum funcionário foi selecionado
 */
export function capturarFiltrosFuncionario() {
    console.log("[LOG] Capturando filtros para a página ficha-funcionario.html...");

    // Captura o valor do dropdown de seleção de funcionário
    const funcionario = document.getElementById("selecaoPessoa").value;
    const dataInicioInput = document.getElementById("dataInicio").value;
    const dataFimInput = document.getElementById("dataFim").value;

    // Verifica se um funcionário foi selecionado
    if (!funcionario) {
        console.warn("[AVISO] Nenhum funcionário foi selecionado.");
        alert("Por favor, selecione um funcionário.");
        return null;
    }

    // Converte as datas para o formato DD/MM
    const dataInicio = formatarData(dataInicioInput);
    const dataFim = formatarData(dataFimInput);

    console.log("[LOG] Filtros capturados:", { funcionario, dataInicio, dataFim });

    // Retorna os filtros capturados
    return { funcionario, dataInicio, dataFim };
}

/**
 * Função auxiliar para formatar a data do input type="date" para DD/MM
 * @param {string} dataInput - A data no formato de entrada do tipo "date" do HTML
 * @returns {string} A data formatada como DD/MM ou uma string vazia se dataInput estiver vazio
 */
function formatarData(dataInput) {
    if (!dataInput) return '';
    const data = new Date(dataInput);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
}