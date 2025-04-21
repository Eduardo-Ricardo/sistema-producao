// Função para obter o número de dias em um mês
function getDiasNoMes(mes, ano) {
    return new Date(ano, mes, 0).getDate();
}

// Função para obter o primeiro dia da semana do mês (0 = Domingo, 1 = Segunda, etc)
function getPrimeiroDiaSemana(mes, ano) {
    return new Date(ano, mes - 1, 1).getDay();
}

// Função para verificar se uma data está em um array de datas
function dataExisteEmRegistros(dia, mes, registros) {
    const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}`;
    return registros.some(grupo => grupo.data === dataFormatada);
}

// Função para verificar se é fim de semana
function ehFimDeSemana(dia, mes, ano) {
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.getDay();
    return diaSemana === 0 || diaSemana === 6; // 0 = Domingo, 6 = Sábado
}

// Função principal para gerar o calendário
export function gerarCalendario(mes, ano, registros) {
    console.log("[LOG] Gerando calendário para:", { mes, ano });
    console.log("[LOG] Registros disponíveis:", registros);

    const containerCalendario = document.getElementById('calendario');
    const diasNoMes = getDiasNoMes(mes, ano);
    const primeiroDia = getPrimeiroDiaSemana(mes, ano);

    // Criar o cabeçalho do calendário
    let html = `
        <div class="calendario-header">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
        </div>
        <div class="calendario">
    `;

    // Adicionar dias vazios do mês anterior
    for (let i = 0; i < primeiroDia; i++) {
        html += '<div class="calendario-dia outro-mes"></div>';
    }

    // Adicionar os dias do mês atual
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

    // Calcular quantos dias faltam para completar a última semana
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

// Função para atualizar o calendário quando o mês é alterado
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