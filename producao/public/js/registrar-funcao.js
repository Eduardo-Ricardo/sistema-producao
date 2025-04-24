import { carregarDados, carregarMachineMap, salvarMachineMap, enviarDadosProducao } from "./dados.js";
import { atualizarDropdownFuncoes, atualizarCampoMaquina, capturarNovaFuncaoEMaquina, capturarDadosFormulario, limparCamposFormulario } from "./ui.js";

const machineMap = {}; // Variável global para armazenar o machineMap

// Carrega o machineMap e atualiza os elementos da página ao carregar
window.onload = async () => {
    console.log("[LOG] Página carregada. Iniciando carregamento do machineMap...");

    try {
        // Carrega o machineMap do backend
        const map = await carregarMachineMap();
        Object.assign(machineMap, map);
        console.log("[LOG] MachineMap carregado com sucesso:", machineMap);

        // Atualiza os elementos da página com os dados do machineMap
        atualizarDropdownFuncoes(machineMap);
        console.log("[LOG] Dropdown de funções atualizado com sucesso.");

        atualizarCampoMaquina(machineMap);
        console.log("[LOG] Campo de máquina atualizado com sucesso.");
    } catch (error) {
        console.error("[ERRO] Falha ao carregar o machineMap:", error);
    }
};

// Aplica os filtros e carrega os dados ao clicar no botão "Aplicar Filtros"
document.getElementById("aplicarFiltrosButton")?.addEventListener("click", () => {
    console.log("[LOG] Botão 'Aplicar Filtros' clicado. Capturando filtros...");

    const filtros = aplicarFiltros();
    if (!filtros) {
        console.warn("[AVISO] Nenhum filtro foi aplicado.");
        return;
    }

    console.log("[LOG] Filtros capturados:", filtros);

    try {
        carregarDados(filtros);
        console.log("[LOG] Dados carregados com sucesso com os filtros aplicados.");
    } catch (error) {
        console.error("[ERRO] Falha ao carregar os dados com os filtros:", error);
    }
});

// Adiciona uma nova função e máquina ao machineMap ao clicar no botão "Adicionar Função"
document.getElementById("adicionarFuncao")?.addEventListener("click", async () => {
    console.log("[LOG] Botão 'Adicionar Função' clicado. Capturando nova função e máquina...");

    try {
        const novaFuncaoEMaquina = await capturarNovaFuncaoEMaquina();
        console.log("[LOG] Nova função e máquina capturadas:", novaFuncaoEMaquina);

        // Atualiza o machineMap com a nova função e máquina
        Object.assign(machineMap, novaFuncaoEMaquina);
        console.log("[LOG] MachineMap atualizado com a nova função e máquina:", machineMap);

        // Salva o machineMap atualizado no backend
        const sucesso = await salvarMachineMap(machineMap);
        if (sucesso) {
            console.log("[LOG] MachineMap salvo com sucesso no backend.");
        } else {
            console.warn("[AVISO] Falha ao salvar o machineMap no backend.");
        }

        // Atualiza os elementos da página com o machineMap atualizado
        atualizarDropdownFuncoes(machineMap);
        console.log("[LOG] Dropdown de funções atualizado com a nova função.");

        atualizarCampoMaquina(machineMap);
        console.log("[LOG] Campo de máquina atualizado com a nova função.");
    } catch (error) {
        console.error("[ERRO] Falha ao adicionar nova função e máquina:", error);
    }
});

// Captura e envia os dados do formulário para o servidor
document.getElementById("productionForm")?.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita o recarregamento da página

    const dados = capturarDadosFormulario();
    if (!dados) {
        console.warn("[AVISO] Dados do formulário inválidos. Cancelando envio.");
        return;
    }

    const { sucesso, mensagem } = await enviarDadosProducao(dados);

    alert(mensagem);

    if (sucesso) {
        limparCamposFormulario();
    }
});

document.getElementById('employeeRole').addEventListener('input', function(e) {
    const funcao = e.target.value;
    const machineInput = document.getElementById('machine');
    
    // Atualiza o campo máquina baseado na função selecionada
    fetch('/data/machineMap.json')
        .then(response => response.json())
        .then(machineMap => {
            machineInput.value = machineMap[funcao] || '';
        })
        .catch(error => console.error('Erro ao carregar mapeamento de máquinas:', error));
});
