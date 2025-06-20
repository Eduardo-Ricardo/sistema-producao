// Este arquivo só captura filtros do usuário (inputs do formulário).
// Não faz mais filtragem ou processamento de arrays de dados.

/**
 * Captura os valores dos filtros selecionados na página ficha-funcionario.html
 * com validações mais robustas e sem alertas (para melhor UX)
 * @returns {Object|null} Um objeto contendo os filtros capturados (funcionario, dataInicio, dataFim) ou null se os filtros são inválidos
 */
export function capturarFiltrosFuncionario() {
    console.log("[LOG] Capturando filtros para a página ficha-funcionario.html...");

    // Referências aos elementos (evita repetir getElementById)
    const erroFuncionario = document.getElementById("erro-funcionario");
    
    // Captura valores dos campos
    const funcionario = document.getElementById("selecaoPessoa").value.trim();
    const dataInicioInput = document.getElementById("dataInicio").value;
    const dataFimInput = document.getElementById("dataFim").value;

    // Verifica se um funcionário foi selecionado (validação já feita no evento click, mas mantida aqui para robustez)
    if (!funcionario) {
        console.warn("[AVISO] Nenhum funcionário foi selecionado.");
        if (erroFuncionario) erroFuncionario.style.display = "block";
        return null;
    }

    // Converte as datas para o formato DD/MM
    const dataInicio = formatarData(dataInicioInput);
    const dataFim = formatarData(dataFimInput);

    // Verificação adicional de consistência das datas
    if (dataInicio && dataFim) {
        const [diaInicio, mesInicio] = dataInicio.split('/').map(Number);
        const [diaFim, mesFim] = dataFim.split('/').map(Number);
        
        if (mesInicio > mesFim || (mesInicio === mesFim && diaInicio > diaFim)) {
            console.warn("[AVISO] Data inicial maior que data final");
            return null;
        }
    }

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