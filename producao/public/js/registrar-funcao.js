import { carregarDados, carregarMachineMap, salvarMachineMap, enviarDadosProducao } from "./dados.js";
import { atualizarDropdownFuncoes, atualizarCampoMaquina, capturarNovaFuncaoEMaquina, limparCamposFormulario } from "./ui.js";
// Importar funções do calendário
import { gerarCalendario } from "./calendario.js";

let machineMap = {}; // Variável global para armazenar o machineMap
let funcoesAdicionais = []; // Array para armazenar as funções adicionais
let mesAtualCalendario = new Date().getMonth() + 1; // Mês atual (1-12)
let anoAtualCalendario = new Date().getFullYear(); // Ano atual
let registrosCalendario = []; // Array para armazenar os registros do calendário

// Event listener para quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
    console.log("[LOG] DOM carregado. Iniciando configuração...");
    await inicializarPagina();

    // Adiciona evento ao dropdown de seleção de funcionário
    const employeeDropdown = document.getElementById("employeeName");
    if (employeeDropdown) {
        employeeDropdown.addEventListener("change", () => {
            console.log("[LOG] Funcionário selecionado:", employeeDropdown.value);
            carregarUltimoRegistro();
        });
    } else {
        console.error("[ERRO] Dropdown de seleção de funcionário não encontrado!");
    }
});

// Função para inicializar a página
async function inicializarPagina() {
    try {
        // Carrega o machineMap do backend
        machineMap = await carregarMachineMap();
        console.log("[LOG] MachineMap carregado com sucesso:", machineMap);

        // Atualiza os elementos da página com os dados do machineMap
        atualizarDropdownFuncoes(machineMap);
        console.log("[LOG] Dropdown de funções atualizado com sucesso.");

        // Configura os event listeners
        setupEventListeners();

        // Carrega as remessas para o dropdown
        await carregarRemessas();
    } catch (error) {
        console.error("[ERRO] Falha ao inicializar a página:", error);
    }
}

// Configurar todos os event listeners
function setupEventListeners() {
    console.log("[LOG] Configurando event listeners...");

    // Event listener para a função principal
    const employeeRole = document.getElementById("employeeRole");
    if (employeeRole) {
        employeeRole.addEventListener("change", function() {
            console.log("[LOG] Função principal alterada:", this.value);
            const funcaoPrincipal = this.value;
            const maquinaPrincipal = encontrarMaquina(funcaoPrincipal);
            document.getElementById("machine").value = maquinaPrincipal;
            
            // Atualiza as opções disponíveis para funções adicionais
            atualizarOpcoesDisponiveisParaFuncoesAdicionais(maquinaPrincipal);
        });
    }

    // Event listener para adicionar função extra
    const btnAddFuncaoExtra = document.getElementById("adicionarFuncaoExtra");
    if (btnAddFuncaoExtra) {
        console.log("[LOG] Botão Adicionar Função Extra encontrado");
        btnAddFuncaoExtra.addEventListener("click", () => {
            console.log("[LOG] Botão Adicionar Função Extra clicado");
            adicionarFuncaoAdicional();
        });
    } else {
        console.error("[ERRO] Botão Adicionar Função Extra não encontrado!");
    }

    // Event listener para o formulário
    const form = document.getElementById("productionForm");
    if (form) {
        form.addEventListener("submit", handleFormSubmit);
    }

    // Event listeners para tipo de entrada (quantidade/lote)
    document.querySelectorAll('input[name="tipoEntrada"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const quantidadeGroup = document.getElementById("quantidadeGroup");
            const loteGroup = document.getElementById("loteGroup");

            if (this.value === "quantidade") {
                quantidadeGroup.style.display = "block";
                loteGroup.style.display = "none";
            } else {
                quantidadeGroup.style.display = "none";
                loteGroup.style.display = "block";
            }
        });
    });

    console.log("[LOG] Event listeners configurados com sucesso");
}

// Encontra a máquina associada a uma função no machineMap
function encontrarMaquina(funcao) {
    // Verifica o formato do machineMap (antigo ou novo)
    const isFormatoAntigo = machineMap && typeof Object.values(machineMap)[0] === 'string';
    
    if (isFormatoAntigo) {
        // Formato antigo: objeto plano de "função": "máquina"
        return machineMap[funcao] || "Máquina não especificada";
    } else {
        // Formato novo: objeto estruturado por seções
        for (const [secao, funcoes] of Object.entries(machineMap)) {
            if (funcao in funcoes) {
                return funcoes[funcao];
            }
        }
    }
    return "Máquina não especificada";
}

// Retorna todas as funções disponíveis para uma determinada máquina
function getFuncoesDaMaquina(maquina) {
    // Verifica o formato do machineMap (antigo ou novo)
    const isFormatoAntigo = machineMap && typeof Object.values(machineMap)[0] === 'string';
    
    const funcoes = [];
    
    if (isFormatoAntigo) {
        // Formato antigo: objeto plano de "função": "máquina"
        Object.entries(machineMap).forEach(([funcao, maquinaFunc]) => {
            if (maquinaFunc === maquina) {
                funcoes.push(funcao);
            }
        });
    } else {
        // Formato novo: objeto estruturado por seções
        for (const [secao, funcoesSecao] of Object.entries(machineMap)) {
            for (const [funcao, maquinaFunc] of Object.entries(funcoesSecao)) {
                if (maquinaFunc === maquina) {
                    funcoes.push(funcao);
                }
            }
        }
    }
    
    return funcoes;
}

// Adiciona uma nova função adicional ao formulário
function adicionarFuncaoAdicional() {
    const maquinaAtual = document.getElementById("machine").value;
    if (!maquinaAtual) {
        alert("Selecione primeiro a função principal!");
        return;
    }

    const funcoesDaMaquina = getFuncoesDaMaquina(maquinaAtual);
    const funcaoPrincipal = document.getElementById("employeeRole").value;
    
    // Remove a função principal das opções
    const funcoesDisponiveis = funcoesDaMaquina.filter(f => f !== funcaoPrincipal);

    if (funcoesDisponiveis.length === 0) {
        alert("Não há outras funções disponíveis para esta máquina!");
        return;
    }

    const container = document.getElementById("funcoes-adicionais");
    const funcaoId = `funcao-${Date.now()}`;

    const funcaoDiv = document.createElement("div");
    funcaoDiv.className = "funcao-adicional";
    funcaoDiv.id = funcaoId;

    // Criar o select para a função
    const select = document.createElement("select");
    select.className = "form-control funcao-select";
    select.innerHTML = `<option value="">Selecione uma função</option>
        ${funcoesDisponiveis.map(f => `<option value="${f}">${f}</option>`).join("")}`;

    // Adicionar o campo de quantidade correspondente
    const quantidadeDiv = document.createElement("div");
    quantidadeDiv.className = "input-group funcao-quantidade";
    quantidadeDiv.id = `quantidade-${funcaoId}`;
    quantidadeDiv.innerHTML = `
        <label class="form-label">
            <i class="fas fa-hashtag"></i> Quantidade:
        </label>
        <input type="number" class="form-control quantidade-adicional" required>
    `;

    // Botão para remover a função
    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.innerHTML = '<i class="fas fa-times"></i>';
    btnRemover.onclick = () => {
        funcaoDiv.remove();
        quantidadeDiv.remove();
        const index = funcoesAdicionais.findIndex(f => f.id === funcaoId);
        if (index > -1) {
            funcoesAdicionais.splice(index, 1);
        }
    };

    funcaoDiv.appendChild(select);
    funcaoDiv.appendChild(btnRemover);
    container.appendChild(funcaoDiv);

    const quantidadesContainer = document.getElementById("quantidades-container");
    quantidadesContainer.appendChild(quantidadeDiv);

    // Adicionar ao array de funções adicionais
    funcoesAdicionais.push({
        id: funcaoId,
        elemento: funcaoDiv,
        quantidadeElemento: quantidadeDiv
    });
}

// Atualiza as opções disponíveis para funções adicionais
function atualizarOpcoesDisponiveisParaFuncoesAdicionais(maquina) {
    const funcoesDaMaquina = getFuncoesDaMaquina(maquina);
    const funcaoPrincipal = document.getElementById("employeeRole").value;
    const funcoesDisponiveis = funcoesDaMaquina.filter(f => f !== funcaoPrincipal);

    // Atualiza os selects existentes
    document.querySelectorAll(".funcao-adicional select").forEach(select => {
        const valorAtual = select.value;
        select.innerHTML = `<option value="">Selecione uma função</option>
            ${funcoesDisponiveis.map(f => `<option value="${f}" ${f === valorAtual ? 'selected' : ''}>${f}</option>`).join("")}`;
    });
}

// Função para carregar as remessas do servidor
async function carregarRemessas() {
    console.log("[LOG] Iniciando carregamento das remessas...");

    try {
        const resposta = await fetch("/producao/remessas");
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar remessas: ${resposta.statusText}`);
        }

        const dados = await resposta.json();
        console.log("[LOG] Remessas carregadas com sucesso:", dados);

        atualizarDropdownRemessas(dados.remessas);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar remessas:", error);
    }
}

// Captura todos os dados do formulário incluindo funções adicionais
function capturarDadosFormulario() {
    const dadosBase = {
        employeeName: document.getElementById("employeeName").value,
        startTime: document.getElementById("startTime").value || "00:00",
        endTime: document.getElementById("endTime").value || "00:00",
        productionDate: document.getElementById("productionDate").value,
        tipoEntrada: document.querySelector('input[name="tipoEntrada"]:checked').value
    };

    // Captura dados da função principal
    const funcaoPrincipal = {
        funcao: document.getElementById("employeeRole").value,
        quantidade: document.getElementById("productionCount").value,
        machine: document.getElementById("machine").value
    };

    // Captura dados das funções adicionais
    const funcoesAdicionaisData = [];
    document.querySelectorAll(".funcao-adicional").forEach(funcaoDiv => {
        const funcao = funcaoDiv.querySelector("select").value;
        if (funcao) {
            const quantidadeInput = document.querySelector(`#quantidade-${funcaoDiv.id} input`);
            funcoesAdicionaisData.push({
                funcao: funcao,
                quantidade: quantidadeInput.value,
                machine: document.getElementById("machine").value
            });
        }
    });

    return {
        ...dadosBase,
        funcaoPrincipal,
        funcoesAdicionais: funcoesAdicionaisData
    };
}

// Handler do formulário separado para melhor organização
async function handleFormSubmit(event) {
    event.preventDefault();
    console.log("[LOG] Formulário de produção submetido");

    const dados = capturarDadosFormulario();
    console.log("[LOG] Dados capturados do formulário:", dados);

    try {
        // Envia a função principal
        await enviarDadosProducao({
            employeeName: dados.employeeName,
            employeeRole: dados.funcaoPrincipal.funcao,
            startTime: dados.startTime,
            endTime: dados.endTime,
            productionCount: dados.funcaoPrincipal.quantidade,
            productionDate: dados.productionDate,
            tipoEntrada: dados.tipoEntrada
        });

        // Envia cada função adicional
        for (const funcaoAdicional of dados.funcoesAdicionais) {
            await enviarDadosProducao({
                employeeName: dados.employeeName,
                employeeRole: funcaoAdicional.funcao,
                startTime: dados.startTime,
                endTime: dados.endTime,
                productionCount: funcaoAdicional.quantidade,
                productionDate: dados.productionDate,
                tipoEntrada: dados.tipoEntrada
            });
        }

        alert("Produção registrada com sucesso!");
        limparCamposFormulario();
        
        // Limpa as funções adicionais
        document.getElementById("funcoes-adicionais").innerHTML = "";
        document.querySelectorAll(".quantidade-adicional").forEach(el => el.remove());
        funcoesAdicionais = [];
        
    } catch (error) {
        console.error("[ERRO] Falha ao enviar dados de produção:", error);
        alert("Erro ao enviar os dados de produção.");
    }
}

async function carregarUltimoRegistro() {
    console.log("[LOG] Iniciando carregamento do último registro...");

    const employeeName = document.getElementById("employeeName").value;
    if (!employeeName) {
        console.warn("[AVISO] Nome do funcionário não fornecido. Não é possível carregar o último registro.");
        return;
    }

    try {
        console.log(`[LOG] Enviando requisição para o backend com o nome do funcionário: ${employeeName}`);
        const resposta = await fetch(`/producao/ultimo-registro?employeeName=${encodeURIComponent(employeeName)}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar o último registro: ${resposta.statusText}`);
        }

        const registro = await resposta.json();
        console.log("[LOG] Último registro carregado com sucesso:", registro);

        if (!registro || Object.keys(registro).length === 0) {
            console.warn("[AVISO] Nenhum registro encontrado para este funcionário.");
            return;
        }

        // Extrair o mês e ano do último registro
        if (registro.productionDate) {
            const [dia, mes] = registro.productionDate.split('/');
            if (dia && mes) {
                mesAtualCalendario = parseInt(mes);
                // O ano será o atual ou anterior dependendo se o mês é maior que o mês atual
                const mesAtual = new Date().getMonth() + 1;
                anoAtualCalendario = mesAtualCalendario > mesAtual 
                    ? new Date().getFullYear() - 1 
                    : new Date().getFullYear();
            }
        }

        // Carregar os registros do funcionário para o calendário
        await carregarRegistrosCalendario(employeeName);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar o último registro:", error);
    }
}

// Função para carregar os registros de produção de um funcionário
async function carregarRegistrosCalendario(employeeName) {
    if (!employeeName) return;

    try {
        console.log(`[LOG] Enviando requisição para carregar registros do funcionário: ${employeeName}`);
        const resposta = await fetch(`/producao/registros-funcionario?employeeName=${encodeURIComponent(employeeName)}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar registros do funcionário: ${resposta.statusText}`);
        }

        const dados = await resposta.json();
        console.log("[LOG] Registros do funcionário carregados com sucesso:", dados);

        registrosCalendario = dados.registros || [];
        
        // Atualizar o nome do mês no calendário
        atualizarNomeMesCalendario();
        
        // Gerar o calendário com os registros
        gerarCalendarioRegistro();
    } catch (error) {
        console.error("[ERRO] Falha ao carregar registros do funcionário:", error);
    }
}

// Função para atualizar o nome do mês mostrado no calendário
function atualizarNomeMesCalendario() {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const mesNome = meses[mesAtualCalendario - 1];
    document.getElementById('mesAtualCalendario').textContent = `${mesNome}/${anoAtualCalendario}`;
}

// Função para verificar se uma data existe nos registros do funcionário
function dataExisteEmRegistros(dia, mes, ano) {
    const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}`;
    return registrosCalendario.some(registro => registro.productionDate === dataFormatada);
}

// Função para verificar se é fim de semana
function ehFimDeSemana(dia, mes, ano) {
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.getDay();
    return diaSemana === 0 || diaSemana === 6; // 0 = Domingo, 6 = Sábado
}

// Função para obter o número de dias em um mês
function getDiasNoMes(mes, ano) {
    return new Date(ano, mes, 0).getDate();
}

// Função para obter o primeiro dia da semana do mês (0 = Domingo, 1 = Segunda, etc)
function getPrimeiroDiaSemana(mes, ano) {
    return new Date(ano, mes - 1, 1).getDay();
}

// Função para gerar o calendário na página de registro
function gerarCalendarioRegistro() {
    console.log("[LOG] Gerando calendário para:", { mes: mesAtualCalendario, ano: anoAtualCalendario });
    
    const containerCalendario = document.getElementById('calendarioRegistro');
    if (!containerCalendario) {
        console.error("[ERRO] Container do calendário não encontrado");
        return;
    }
    
    const diasNoMes = getDiasNoMes(mesAtualCalendario, anoAtualCalendario);
    const primeiroDia = getPrimeiroDiaSemana(mesAtualCalendario, anoAtualCalendario);

    // Criar o cabeçalho do calendário
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

    // Adicionar dias vazios do mês anterior
    for (let i = 0; i < primeiroDia; i++) {
        html += '<div class="calendario-dia outro-mes"></div>';
    }

    // Adicionar os dias do mês atual
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const temRegistro = dataExisteEmRegistros(dia, mesAtualCalendario, anoAtualCalendario);
        const fimDeSemana = ehFimDeSemana(dia, mesAtualCalendario, anoAtualCalendario);
        
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
