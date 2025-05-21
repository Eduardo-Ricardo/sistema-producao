/**
 * Retorna o número de dias em um mês.
 * @param {number} mes
 * @param {number} ano
 * @returns {number}
 */
export function getDiasNoMes(mes, ano) {
    return new Date(ano, mes, 0).getDate();
}

/**
 * Retorna o dia da semana do primeiro dia do mês (0 = Domingo, 1 = Segunda, ...).
 * @param {number} mes
 * @param {number} ano
 * @returns {number}
 */
export function getPrimeiroDiaSemana(mes, ano) {
    return new Date(ano, mes - 1, 1).getDay();
}

/**
 * Verifica se a data é fim de semana.
 * @param {number} dia
 * @param {number} mes
 * @param {number} ano
 * @returns {boolean}
 */
export function ehFimDeSemana(dia, mes, ano) {
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.getDay();
    return diaSemana === 0 || diaSemana === 6; // 0 = Domingo, 6 = Sábado
}

/**
 * Verifica se uma data (dia/mes) existe em um array de registros.
 * @param {number} dia
 * @param {number} mes
 * @param {Array<{productionDate: string}>} registros
 * @returns {boolean}
 */
export function dataExisteEmRegistros(dia, mes, registros) {
    const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}`;
    return registros.some(registro => registro.productionDate === dataFormatada || registro.data === dataFormatada);
}

/**
 * Gera o calendário de produção para uso em registrar-funcao.js.
 * @param {number} mes
 * @param {number} ano
 * @param {Array<{productionDate: string}>} registros
 * @param {string} containerId
 */
export function gerarCalendarioRegistro(mes, ano, registros, containerId = 'calendarioRegistro') {
    const containerCalendario = document.getElementById(containerId);
    if (!containerCalendario) {
        console.error('[ERRO] Container do calendário não encontrado');
        return;
    }
    const diasNoMes = getDiasNoMes(mes, ano);
    const primeiroDia = getPrimeiroDiaSemana(mes, ano);
    let html = `
        <div class="calendario-header">
            <span>D</span>
            <span>S</span>
            <span>T</span>
            <span>Q</span>
            <span>Q</span>
            <span>S</span>
            <span>S</span>
        </div>
        <div class="calendario-dias">
    `;
    for (let i = 0; i < primeiroDia; i++) {
        html += '<div class="calendario-dia outro-mes"></div>';
    }
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const temRegistro = dataExisteEmRegistros(dia, mes, registros);
        const fimDeSemana = ehFimDeSemana(dia, mes, ano);
        let classe = 'calendario-dia';
        if (temRegistro) {
            classe += ' tem-registro';
        } else if (!fimDeSemana) {
            classe += ' sem-registro';
        } else {
            classe += ' fim-de-semana';
        }
        html += `<div class="${classe}">${dia}</div>`;
    }
    const totalDias = primeiroDia + diasNoMes;
    const diasRestantes = 7 - (totalDias % 7);
    if (diasRestantes < 7) {
        for (let i = 0; i < diasRestantes; i++) {
            html += '<div class="calendario-dia outro-mes"></div>';
        }
    }
    html += '</div>';
    containerCalendario.innerHTML = html;
}

/**
 * Inicializa o calendário na tela e adiciona eventos de mudança de mês.
 * @param {Array<{data: string}>} registros - Registros do funcionário
 */
export function inicializarCalendario(registros) {
    console.log("[LOG] Inicializando calendário...");
    
    const selectMes = document.getElementById('mesCalendario');
    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();

    // Definir o mês atual como selecionado
    selectMes.value = mesAtual;

    // Gerar o calendário inicial
    gerarCalendario(mesAtual, anoAtual, registros);

    // Adicionar evento para atualizar o calendário quando o mês é alterado
    selectMes.addEventListener('change', (e) => {
        const mesSelecionado = parseInt(e.target.value);
        gerarCalendario(mesSelecionado, anoAtual, registros);
    });

    console.log("[LOG] Calendário inicializado com sucesso.");
}