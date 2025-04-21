// Atualiza a tabela de produção na tela visualizar.html
export function atualizarTabela(dados) {
    console.log("[LOG] Iniciando atualização da tabela de produção...");

    const tabela = document.getElementById("tabelaProducao")?.getElementsByTagName("tbody")[0];
    if (!tabela) {
        console.warn("[AVISO] Tabela de produção não encontrada.");
        return;
    }

    tabela.innerHTML = ""; // Limpa os dados antigos

    dados.forEach(item => {
        let linha = tabela.insertRow();
        linha.insertCell(0).innerText = item.employeeName;
        linha.insertCell(1).innerText = item.employeeRole;
        linha.insertCell(2).innerText = item.startTime;
        linha.insertCell(3).innerText = item.endTime;
        linha.insertCell(4).innerText = item.productionCount;
        linha.insertCell(5).innerText = item.productionDate;
    });

    console.log("[LOG] Tabela de produção atualizada com sucesso.");
}

// Atualiza o dropdown de funções na tela registrar.html
export function atualizarDropdownFuncoes(machineMap) {
    console.log("[LOG] Atualizando dropdown de funções com machineMap:", machineMap);

    const employeeRoleSelect = document.getElementById("employeeRole");
    if (!employeeRoleSelect) {
        console.warn("[AVISO] Dropdown de funções não encontrado.");
        return;
    }

    employeeRoleSelect.innerHTML = ""; // Limpa os dados antigos

    Object.keys(machineMap).forEach(funcao => {
        let option = document.createElement("option");
        option.value = funcao; // O valor será a função
        option.innerText = funcao; // O texto visível será a função
        employeeRoleSelect.appendChild(option);
    });

    console.log("[LOG] Dropdown de funções atualizado com sucesso.");
}

// Atualiza o campo de máquina ao selecionar o dropdown na tela registrar.html
export function atualizarCampoMaquina(machineMap) {
    console.log("[LOG] Configurando EventListener para atualizar o campo de máquina...");

    const employeeRoleSelect = document.getElementById("employeeRole");
    if (!employeeRoleSelect) {
        console.warn("[AVISO] Dropdown de funções não encontrado.");
        return;
    }

    employeeRoleSelect.addEventListener("change", function () {
        const selectedFunction = this.value;
        console.log("[LOG] Função selecionada:", selectedFunction);

        const machine = machineMap[selectedFunction] || "Máquina não especificada";
        const machineInput = document.getElementById("machine");
        if (machineInput) {
            machineInput.value = machine;
            console.log("[LOG] Máquina atualizada para:", machine);
        } else {
            console.warn("[AVISO] Campo de máquina não encontrado.");
        }
    });
}

// Adiciona uma nova opção ao dropdown de funções
export function adicionarOpcaoAoDropdown(funcao) {
    console.log("[LOG] Adicionando nova opção ao dropdown de funções:", funcao);

    const employeeRoleSelect = document.getElementById("employeeRole");
    if (!employeeRoleSelect) {
        console.warn("[AVISO] Dropdown de funções não encontrado.");
        return;
    }

    const novaOpcao = document.createElement("option");
    novaOpcao.value = funcao;
    novaOpcao.innerText = funcao;
    employeeRoleSelect.appendChild(novaOpcao);

    console.log("[LOG] Nova opção adicionada ao dropdown de funções com sucesso.");
}

// Captura nova função e máquina do usuário e retorna um objeto com essas informações
export function capturarNovaFuncaoEMaquina() {
    console.log("[LOG] Iniciando captura de nova função e máquina...");

    const novaFuncao = prompt("Digite o nome da nova função:");
    if (!novaFuncao) {
        console.warn("[AVISO] Nenhuma função foi digitada.");
        alert("A função não pode ser vazia.");
        return null;
    }

    let novaMaquina = null;

    while (!novaMaquina) {
        novaMaquina = prompt(`Digite o nome da máquina para a função "${novaFuncao}":\nOu deixe vazio para usar "Máquina não especificada".`);
        if (novaMaquina === null) {
            console.warn("[AVISO] Operação cancelada pelo usuário.");
            alert("Operação cancelada. Nenhuma função foi adicionada.");
            return null;
        } else if (novaMaquina.trim() === "") {
            novaMaquina = "Máquina não especificada";
        }
    }

    console.log("[LOG] Nova função e máquina capturadas:", { novaFuncao, novaMaquina });
    return { [novaFuncao]: novaMaquina };
}

// Atualiza a tabela de dados do funcionário na página ficha-funcionario.html
export function preencherTabelaFuncionario(dados) {
    console.log("[LOG] Iniciando preenchimento da tabela de dados do funcionário...");

    const tbody = document.getElementById("tabelaDadosPessoa").querySelector("tbody");
    tbody.innerHTML = ""; // Limpar tabela

    dados.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.Funcao}</td>
            <td>${item.Maquina}</td>
            <td>${item.Data}</td>
            <td>${item.Inicio}</td>
            <td>${item.Fim}</td>
            <td>${item.Quantidade}</td>
        `;
        tbody.appendChild(row);
    });

    console.log("[LOG] Tabela de dados do funcionário preenchida com sucesso.");
}

// Calcula e exibe o resumo dos dados do funcionário na página ficha-funcionario.html
export function calcularResumoFuncionario(dados) {
    console.log("[LOG] Iniciando cálculo do resumo dos dados do funcionário...");

    const totalFuncoes = dados.length;
    const totalQuantidade = dados.reduce((acc, item) => acc + (item.Quantidade || 0), 0);
    const mediaGeral = totalQuantidade / totalFuncoes;

    document.getElementById("totalFuncoes").textContent = totalFuncoes;
    document.getElementById("mediaGeral").textContent = mediaGeral.toFixed(2);

    console.log("[LOG] Resumo dos dados do funcionário calculado com sucesso.");
}

// Preenche o dropdown com os nomes dos funcionários
export function preencherDropdownFuncionarios(nomes) {
    console.log("[LOG] Iniciando preenchimento do dropdown com os nomes dos funcionários...");

    const dropdown = document.getElementById("selecaoPessoa");
    dropdown.innerHTML = '<option value="">Selecione um funcionário</option>'; // Limpar e adicionar opção padrão

    nomes.forEach((nome) => {
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        dropdown.appendChild(option);
    });

    console.log("[LOG] Dropdown de funcionários preenchido com sucesso.");
}

// Captura os dados do formulário de produção
export function capturarDadosFormulario() {
    console.log("[LOG] Capturando os dados do formulário...");

    const employeeName = document.getElementById("employeeName").value.trim();
    const employeeRole = document.getElementById("employeeRole").value.trim();
    const machine = document.getElementById("machine").value.trim();
    const startTime = document.getElementById("startTime").value || null; // Valor padrão: null
    const endTime = document.getElementById("endTime").value || null; // Valor padrão: null
    const productionDate = document.getElementById("productionDate").value.trim();

    let productionCount = document.getElementById("productionCount").value;

    // Validação básica
    if (!employeeName || !employeeRole || !machine || !productionDate || !productionCount) {
        alert("Preencha todos os campos obrigatórios!");
        return null;
    }

    try {
        productionCount = eval(productionCount.replace(/[^0-9+\-*/().]/g, ""));
        console.log("[LOG] Quantidade produzida calculada:", productionCount);

        if (isNaN(productionCount)) {
            throw new Error("A expressão de quantidade produzida é inválida.");
        }
    } catch (error) {
        console.error("[ERRO] Falha ao calcular a quantidade produzida:", error);
        alert("Erro: A expressão de quantidade produzida é inválida.");
        return null;
    }

    return { employeeName, employeeRole, machine, startTime, endTime, productionCount, productionDate };
}

// Limpa os campos do formulário após o envio
export function limparCamposFormulario() {
    console.log("[LOG] Limpando os campos do formulário...");
    document.getElementById("employeeRole").value = "";
    document.getElementById("machine").value = "";
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("productionCount").value = "";
}
