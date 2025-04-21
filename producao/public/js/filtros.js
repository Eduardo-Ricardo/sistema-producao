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

// Captura os valores dos filtros selecionados na página ficha-funcionario.html
export function capturarFiltrosFuncionario() {
    console.log("[LOG] Capturando filtros para a página ficha-funcionario.html...");

    // Captura o valor do dropdown de seleção de funcionário
    const funcionario = document.getElementById("selecaoPessoa").value;

    // Verifica se um funcionário foi selecionado
    if (!funcionario) {
        console.warn("[AVISO] Nenhum funcionário foi selecionado.");
        alert("Por favor, selecione um funcionário.");
        return null;
    }

    console.log("[LOG] Filtro capturado: { funcionario: ", funcionario, " }");

    // Retorna o filtro capturado
    return { funcionario };
}