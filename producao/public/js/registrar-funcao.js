import { carregarDados, carregarMachineMap, salvarMachineMap, enviarDadosProducao } from "./dados.js";
import { atualizarDropdownFuncoes, atualizarCampoMaquina, capturarNovaFuncaoEMaquina, limparCamposFormulario } from "./ui.js";

let machineMap = {}; // Variável global para armazenar o machineMap
let funcoesAdicionais = []; // Array para armazenar as funções adicionais

// Event listener para quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
    console.log("[LOG] DOM carregado. Iniciando configuração...");
    await inicializarPagina();
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
    for (const [secao, funcoes] of Object.entries(machineMap)) {
        if (funcao in funcoes) {
            return funcoes[funcao];
        }
    }
    return "Máquina não especificada";
}

// Retorna todas as funções disponíveis para uma determinada máquina
function getFuncoesDaMaquina(maquina) {
    const funcoes = [];
    for (const [secao, funcoesSecao] of Object.entries(machineMap)) {
        for (const [funcao, maquinaFunc] of Object.entries(funcoesSecao)) {
            if (maquinaFunc === maquina) {
                funcoes.push(funcao);
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
