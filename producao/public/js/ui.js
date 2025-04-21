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

    // Itera sobre cada grupo de data
    dados.registros.forEach((grupo) => {
        // Criar linha de cabeçalho para a data
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <td colspan="6" style="background-color: #f0f0f0; font-weight: bold; text-align: center;">
                Data: ${grupo.data}
            </td>
        `;
        tbody.appendChild(headerRow);

        // Adicionar os registros do dia
        grupo.registros.forEach((registro) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${registro.Funcao}</td>
                <td>${registro.Inicio}</td>
                <td>${registro.Fim}</td>
                <td>${registro.Quantidade}</td>
            `;
            tbody.appendChild(row);
        });

        // Adicionar linha com totais do dia
        const totalDia = grupo.registros.reduce((acc, registro) => acc + registro.Quantidade, 0);
        const mediaDia = totalDia / grupo.registros.length;
        
        const totalRow = document.createElement("tr");
        totalRow.innerHTML = `
            <td colspan="3" style="text-align: right; font-weight: bold;">Total do dia:</td>
            <td style="font-weight: bold;">${totalDia}</td>
            <td colspan="2"></td>
        `;
        tbody.appendChild(totalRow);

        // Adicionar linha em branco para separar os dias
        const spacerRow = document.createElement("tr");
        spacerRow.innerHTML = '<td colspan="6" style="height: 10px;"></td>';
        tbody.appendChild(spacerRow);
    });

    // Exibir as funções únicas
    preencherFuncoesUnicas(dados.funcoes);

    console.log("[LOG] Tabela de dados do funcionário preenchida com sucesso.");
}

// Nova função para exibir as funções únicas
export function preencherFuncoesUnicas(funcoes) {
    console.log("[LOG] Preenchendo grid de funções únicas...");
    
    const funcoesGrid = document.getElementById("funcoes-grid");
    funcoesGrid.innerHTML = ""; // Limpa o conteúdo anterior

    // Ordena as funções por quantidade de registros (decrescente)
    funcoes.sort((a, b) => b.quantidade_registros - a.quantidade_registros);

    funcoes.forEach(funcao => {
        const funcaoElement = document.createElement("div");
        funcaoElement.className = "resumo-item";
        funcaoElement.innerHTML = `
            <h3>${funcao.funcao}</h3>
            <div class="funcao-detalhes">
                <p>Total Produzido: <span>${funcao.total}</span></p>
                <p>Horas Trabalhadas: <span>${funcao.total_horas}</span></p>
                <p>Média/Hora: <span>${funcao.media_por_hora}/h</span></p>
                <p>Registros: <span>${funcao.quantidade_registros}</span></p>
            </div>
        `;
        funcoesGrid.appendChild(funcaoElement);
    });

    console.log("[LOG] Grid de funções únicas preenchido com sucesso.");
}

// Calcula e exibe o resumo dos dados do funcionário na página ficha-funcionario.html
export function calcularResumoFuncionario(dados) {
    console.log("[LOG] Iniciando cálculo do resumo dos dados do funcionário...");

    const totalDias = dados.length;
    const totalRegistros = dados.reduce((acc, grupo) => acc + grupo.registros.length, 0);
    const totalQuantidade = dados.reduce((acc, grupo) => 
        acc + grupo.registros.reduce((sum, registro) => sum + registro.Quantidade, 0), 0);
    
    const mediaGeral = totalQuantidade / totalRegistros;
    const mediaPorDia = totalQuantidade / totalDias;

    document.getElementById("totalDias").textContent = totalDias;
    document.getElementById("totalRegistros").textContent = totalRegistros;
    document.getElementById("mediaGeral").textContent = mediaGeral.toFixed(2);
    document.getElementById("mediaPorDia").textContent = mediaPorDia.toFixed(2);

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
