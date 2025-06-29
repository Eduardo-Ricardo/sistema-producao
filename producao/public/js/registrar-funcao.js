import { carregarDados, carregarMachineMap, salvarMachineMap, enviarDadosProducao } from "./dados.js";
import { atualizarDropdownFuncoes, atualizarCampoMaquina, capturarNovaFuncaoEMaquina, limparCamposFormulario } from "./ui.js";
// Importar funções do calendário
import { gerarCalendarioRegistro, getDiasNoMes, getPrimeiroDiaSemana, ehFimDeSemana, dataExisteEmRegistros } from "./calendario.js";
import { encontrarMaquina, getFuncoesDaMaquina, atualizarOpcoesDisponiveisParaFuncoesAdicionais, adicionarFuncaoAdicional } from "./funcoes-maquinas.js";
// Importar funções de remessas e lotes
import { carregarRemessasParaDropdown, carregarLotesDaRemessa } from "./remessas-lotes.js";

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

/**
 * Inicializa a página de registro de produção, carregando dados e configurando eventos.
 */
async function inicializarPagina() {
    try {
        // Carrega o machineMap do backend
        machineMap = await carregarMachineMap();
        console.log("[LOG] MachineMap carregado com sucesso:", machineMap);        // Atualiza os elementos da página com os dados do machineMap
        atualizarDropdownFuncoes(machineMap);
        console.log("[LOG] Dropdown de funções atualizado com sucesso.");
        
        // Configura a atualização automática do campo de máquina
        atualizarCampoMaquina(machineMap);
        console.log("[LOG] Configuração para atualização do campo de máquina concluída.");        // Configura os event listeners
        setupEventListeners();

        // Carrega as remessas para o dropdown
        await carregarRemessasParaDropdown();
    } catch (error) {
        console.error("[ERRO] Falha ao inicializar a página:", error);
    }
}

/**
 * Configura todos os event listeners da página de registro.
 */
function setupEventListeners() {
    console.log("[LOG] Configurando event listeners...");

    // Event listener para a função principal
    const employeeRole = document.getElementById("employeeRole");
    if (employeeRole) {
        employeeRole.addEventListener("change", function() {
            console.log("[LOG] Função principal alterada:", this.value);
            const funcaoPrincipal = this.value;
            const maquinaPrincipal = encontrarMaquina(funcaoPrincipal, machineMap);
            document.getElementById("machine").value = maquinaPrincipal;
            
            // Atualiza as opções disponíveis para funções adicionais
            atualizarOpcoesDisponiveisParaFuncoesAdicionais(maquinaPrincipal, machineMap);
        });
    }

    // Event listener para adicionar função extra
    const btnAddFuncaoExtra = document.getElementById("adicionarFuncaoExtra");
    if (btnAddFuncaoExtra) {
        console.log("[LOG] Botão Adicionar Função Extra encontrado");
        btnAddFuncaoExtra.addEventListener("click", () => {
            console.log("[LOG] Botão Adicionar Função Extra clicado");
            adicionarFuncaoAdicional(machineMap, funcoesAdicionais);
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

/**
 * Captura todos os dados do formulário, incluindo funções adicionais.
 * @returns {Object}
 */
function capturarDadosFormulario() {
    const dadosBase = {
        employeeName: document.getElementById("employeeName").value,
        startTime: document.getElementById("startTime").value || "00:00",
        endTime: document.getElementById("endTime").value || "00:00",
        productionDate: document.getElementById("productionDate").value,
        tipoEntrada: document.querySelector('input[name="tipoEntrada"]:checked').value
    };

    // Obtém a quantidade principal que será usada para todas as funções
    const quantidadePrincipal = document.getElementById("productionCount").value;

    // Captura dados da função principal
    const funcaoPrincipal = {
        funcao: document.getElementById("employeeRole").value,
        quantidade: quantidadePrincipal,
        machine: document.getElementById("machine").value
    };

    // Captura dados das funções adicionais
    const funcoesAdicionaisData = [];
    document.querySelectorAll(".funcao-adicional").forEach(funcaoDiv => {
        const funcao = funcaoDiv.querySelector("select").value;
        if (funcao) {
            funcoesAdicionaisData.push({
                funcao: funcao,
                quantidade: quantidadePrincipal, // Usa a mesma quantidade da função principal
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

/**
 * Handler do formulário para submissão dos dados de produção.
 * @param {Event} event
 */
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

/**
 * Carrega o último registro de produção de um funcionário e atualiza o calendário.
 */
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
        }        // Extrair o mês e ano do último registro
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

/**
 * Carrega os registros de produção de um funcionário e atualiza o calendário.
 * @param {string} employeeName
 */
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
        gerarCalendarioRegistro(mesAtualCalendario, anoAtualCalendario, registrosCalendario);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar registros do funcionário:", error);
    }
}

/**
 * Atualiza o nome do mês mostrado no calendário.
 */
function atualizarNomeMesCalendario() {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const mesNome = meses[mesAtualCalendario - 1];
    document.getElementById('mesAtualCalendario').textContent = `${mesNome}/${anoAtualCalendario}`;
}

// registrar-funcao.js agora contém apenas:
// - Inicialização da página
// - Configuração de eventos de UI
// - Coleta de dados do formulário
// - Integração com backend (fetch, envio de dados, etc.)
// Toda lógica de negócio de funções/máquinas e calendário está delegada aos módulos externos.
