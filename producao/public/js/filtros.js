// Aplica os filtros selecionados na página (exemplo genérico para outra funcionalidade)
export function aplicarFiltros() {
    console.log("[LOG] Iniciando aplicação dos filtros...");

    // Captura os valores dos filtros
    const employeeName = document.getElementById("employeeName").value;
    const employeeRole = document.getElementById("employeeRole").value;
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;

    console.log("[LOG] Filtros capturados:", { employeeName, employeeRole, day, month });

    // Retorna os filtros capturados
    return { employeeName, employeeRole, day, month };
}

// Função auxiliar para formatar a data do input type="date" para DD/MM
function formatarData(dataInput) {
    if (!dataInput) return '';
    const data = new Date(dataInput);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
}

// Captura os valores dos filtros selecionados na página ficha-funcionario.html
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