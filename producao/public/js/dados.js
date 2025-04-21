import { atualizarTabela } from "./ui.js";

// Carrega os dados da tabela de produção para carregar em visualizar.html
export async function carregarDados(filtros) {
    console.log("[LOG] Iniciando carregamento dos dados com filtros:", filtros);

    const queryParams = new URLSearchParams(filtros);

    try {
        const resposta = await fetch(`/producao/dados?${queryParams.toString()}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar os dados: ${resposta.statusText}`);
        }

        const dados = await resposta.json();
        console.log("[LOG] Dados carregados com sucesso:", dados);

        atualizarTabela(dados);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar os dados:", error);
    }
}

// Retorna o machineMap
export async function carregarMachineMap() {
    console.log("[LOG] Iniciando carregamento do machineMap...");

    try {
        const resposta = await fetch("/producao/getMachineMap");
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar machineMap: ${resposta.statusText}`);
        }

        const machineMap = await resposta.json();
        console.log("[LOG] MachineMap carregado com sucesso:", machineMap);

        return machineMap;
    } catch (error) {
        console.error("[ERRO] Falha ao carregar machineMap:", error);
        return {};
    }
}

// Salva o machineMap no servidor
// O machineMap deve ser um objeto onde as chaves são funções e os valores são máquinas
export async function salvarMachineMap(machineMap) {
    console.log("[LOG] Iniciando salvamento do machineMap:", machineMap);

    try {
        const resposta = await fetch("/producao/setMachineMap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(machineMap),
        });

        if (resposta.ok) {
            console.log("[LOG] MachineMap salvo com sucesso:", machineMap);
            return true;
        } else {
            console.error("[ERRO] Falha ao salvar machineMap:", resposta.statusText);
            return false;
        }
    } catch (error) {
        console.error("[ERRO] Falha ao salvar machineMap:", error);
        return false;
    }
}

// Faz uma requisição ao backend para buscar os dados do funcionário na página ficha-funcionario.html
export async function carregarDadosFuncionarioBackend(funcionario, dataInicio, dataFim) {
    console.log(`[LOG] Iniciando carregamento dos dados do funcionário: ${funcionario}`);
    console.log(`[LOG] Período: ${dataInicio || 'início'} até ${dataFim || 'fim'}`);

    try {
        const params = new URLSearchParams({ funcionario });
        if (dataInicio) params.append('dataInicio', dataInicio);
        if (dataFim) params.append('dataFim', dataFim);

        const response = await fetch(`/producao/dados-funcionario?${params.toString()}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar os dados do servidor.");
        }

        const dados = await response.json();
        console.log("[LOG] Dados do funcionário carregados com sucesso:", dados);

        return dados;
    } catch (error) {
        console.error("[ERRO] Falha ao carregar os dados do funcionário:", error);
        alert("Erro ao carregar os dados do funcionário.");
        return [];
    }
}

// Faz uma requisição ao backend para buscar os nomes dos funcionários
export async function carregarNomesFuncionariosBackend() {
    console.log("[LOG] Iniciando carregamento dos nomes dos funcionários...");

    try {
        const response = await fetch(`/producao/nomes-funcionarios`);
        if (!response.ok) {
            throw new Error("Erro ao buscar os nomes dos funcionários.");
        }

        const nomes = await response.json();
        console.log("[LOG] Nomes dos funcionários carregados com sucesso:", nomes);

        return nomes;
    } catch (error) {
        console.error("[ERRO] Falha ao carregar os nomes dos funcionários:", error);
        alert("Erro ao carregar os nomes dos funcionários.");
        return [];
    }
}

// Envia os dados de produção para o servidor
export async function enviarDadosProducao(dados) {
    console.log("[LOG] Dados a serem enviados para o servidor:", dados); // Adicione este log

    try {
        const resposta = await fetch("/producao/salvar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        const resultado = await resposta.json();
        console.log("[LOG] Resposta do servidor:", resultado);

        return { sucesso: resposta.ok, mensagem: resultado.message || resultado.error };
    } catch (error) {
        console.error("[ERRO] Falha ao enviar os dados de produção:", error);
        return { sucesso: false, mensagem: "Erro ao enviar os dados de produção." };
    }
}