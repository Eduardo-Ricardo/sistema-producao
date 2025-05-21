/**
 * Encontra a máquina associada a uma função no machineMap.
 * @param {string} funcao
 * @param {Object} machineMap
 * @returns {string}
 */
export function encontrarMaquina(funcao, machineMap) {
    const isFormatoAntigo = machineMap && typeof Object.values(machineMap)[0] === 'string';
    if (isFormatoAntigo) {
        return machineMap[funcao] || "Máquina não especificada";
    } else {
        for (const [secao, funcoes] of Object.entries(machineMap)) {
            if (funcao in funcoes) {
                return funcoes[funcao];
            }
        }
    }
    return "Máquina não especificada";
}

/**
 * Retorna todas as funções disponíveis para uma determinada máquina.
 * @param {string} maquina
 * @param {Object} machineMap
 * @returns {string[]}
 */
export function getFuncoesDaMaquina(maquina, machineMap) {
    const isFormatoAntigo = machineMap && typeof Object.values(machineMap)[0] === 'string';
    const funcoes = [];
    if (isFormatoAntigo) {
        Object.entries(machineMap).forEach(([funcao, maquinaFunc]) => {
            if (maquinaFunc === maquina) {
                funcoes.push(funcao);
            }
        });
    } else {
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

/**
 * Atualiza as opções disponíveis para funções adicionais.
 * @param {string} maquina
 * @param {Object} machineMap
 */
export function atualizarOpcoesDisponiveisParaFuncoesAdicionais(maquina, machineMap) {
    const funcoesDaMaquina = getFuncoesDaMaquina(maquina, machineMap);
    const funcaoPrincipal = document.getElementById("employeeRole").value;
    const funcoesDisponiveis = funcoesDaMaquina.filter(f => f !== funcaoPrincipal);
    document.querySelectorAll(".funcao-adicional select").forEach(select => {
        const valorAtual = select.value;
        select.innerHTML = `<option value="">Selecione uma função</option>` +
            funcoesDisponiveis.map(f => `<option value="${f}" ${f === valorAtual ? 'selected' : ''}>${f}</option>`).join("");
    });
}

/**
 * Adiciona uma nova função adicional ao formulário.
 * @param {Object} machineMap
 * @param {Array} funcoesAdicionais
 */
export function adicionarFuncaoAdicional(machineMap, funcoesAdicionais) {
    const maquinaAtual = document.getElementById("machine").value;
    if (!maquinaAtual) {
        alert("Selecione primeiro a função principal!");
        return;
    }
    const funcoesDaMaquina = getFuncoesDaMaquina(maquinaAtual, machineMap);
    const funcaoPrincipal = document.getElementById("employeeRole").value;
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
    const select = document.createElement("select");
    select.className = "form-control funcao-select";
    select.innerHTML = `<option value="">Selecione uma função</option>` +
        funcoesDisponiveis.map(f => `<option value="${f}">${f}</option>`).join("");
    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.innerHTML = '<i class="fas fa-times"></i>';
    btnRemover.onclick = () => {
        funcaoDiv.remove();
        const index = funcoesAdicionais.findIndex(f => f.id === funcaoId);
        if (index > -1) {
            funcoesAdicionais.splice(index, 1);
        }
    };
    funcaoDiv.appendChild(select);
    funcaoDiv.appendChild(btnRemover);
    container.appendChild(funcaoDiv);
    funcoesAdicionais.push({
        id: funcaoId,
        elemento: funcaoDiv
    });
}
