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
    console.log("[LOG] Atualizando lista de funções...");

    const datalist = document.getElementById("funcoes");
    if (!datalist) {
        console.warn("[AVISO] Datalist de funções não encontrado.");
        return;
    }

    // Limpa as opções existentes
    datalist.innerHTML = '';

    // Verifica o formato do machineMap (antigo ou novo)
    const isFormatoAntigo = machineMap && typeof Object.values(machineMap)[0] === 'string';

    if (isFormatoAntigo) {
        // Formato antigo: objeto plano de "função": "máquina"
        Object.keys(machineMap).forEach(funcao => {
            const option = document.createElement("option");
            option.value = funcao;
            datalist.appendChild(option);
        });
    } else {
        // Formato novo: objeto estruturado por seções
        Object.entries(machineMap).forEach(([secao, funcoes]) => {
            // Para cada seção, adiciona suas funções ao datalist
            Object.keys(funcoes).forEach(funcao => {
                const option = document.createElement("option");
                option.value = funcao;
                option.dataset.secao = secao; // Armazena a seção para referência
                datalist.appendChild(option);
            });
        });
    }

    console.log("[LOG] Lista de funções atualizada com sucesso.");
}

// Atualiza o campo de máquina ao selecionar o dropdown na tela registrar.html
export function atualizarCampoMaquina(machineMap) {
    console.log("[LOG] Configurando EventListener para atualizar o campo de máquina...");

    const employeeRoleInput = document.getElementById("employeeRole");
    if (!employeeRoleInput) {
        console.warn("[AVISO] Input de funções não encontrado.");
        return;
    }

    employeeRoleInput.addEventListener("input", function () {
        const selectedFunction = this.value;
        console.log("[LOG] Função selecionada:", selectedFunction);

        // Verifica o formato do machineMap (antigo ou novo)
        const isFormatoAntigo = machineMap && typeof Object.values(machineMap)[0] === 'string';
        
        let machine = "Máquina não especificada";
        
        if (isFormatoAntigo) {
            // Formato antigo: objeto plano de "função": "máquina"
            if (selectedFunction in machineMap) {
                machine = machineMap[selectedFunction];
            }
        } else {
            // Formato novo: objeto estruturado por seções
            for (const [secao, funcoes] of Object.entries(machineMap)) {
                if (selectedFunction in funcoes) {
                    machine = funcoes[selectedFunction];
                    break;
                }
            }
        }

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
export function capturarNovaFuncaoEMaquina(machineMap) {
    console.log("[LOG] Iniciando captura de nova função e máquina...");

    // Verifica o formato do machineMap (antigo ou novo)
    const isFormatoAntigo = machineMap && typeof Object.values(machineMap)[0] === 'string';
    
    // Se for formato antigo, retorna um objeto simples
    if (isFormatoAntigo) {
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

        console.log("[LOG] Nova função e máquina capturadas (formato antigo):", { novaFuncao, novaMaquina });
        return {
            funcao: novaFuncao,
            maquina: novaMaquina
        };
    }
    
    // Formato novo - fluxo original
    const secoes = Object.keys(machineMap);
    let secaoSelecionada = prompt(
        `Selecione a seção para a nova função (digite o número):\n` +
        secoes.map((secao, index) => `${index + 1}. ${secao}`).join('\n')
    );

    // Validação da seção
    if (!secaoSelecionada) {
        console.warn("[AVISO] Nenhuma seção selecionada.");
        alert("É necessário selecionar uma seção.");
        return null;
    }

    // Converte a entrada do usuário para o nome da seção
    const indexSecao = parseInt(secaoSelecionada) - 1;
    if (isNaN(indexSecao) || indexSecao < 0 || indexSecao >= secoes.length) {
        console.warn("[AVISO] Seção inválida selecionada.");
        alert("Seção inválida selecionada.");
        return null;
    }
    secaoSelecionada = secoes[indexSecao];

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

    console.log("[LOG] Nova função e máquina capturadas (formato novo):", { secaoSelecionada, novaFuncao, novaMaquina });
    return {
        secao: secaoSelecionada,
        funcao: novaFuncao,
        maquina: novaMaquina
    };
}

// Atualiza a tabela de dados do funcionário na página ficha-funcionario.html
export function preencherTabelaFuncionario(dados) {
    console.log("[LOG] Iniciando preenchimento da tabela de dados do funcionário...");

    const tbody = document.getElementById("tabelaDadosPessoa").querySelector("tbody");
    tbody.innerHTML = ""; // Limpar tabela

    // Funções de exibição abaixo usam apenas dados já processados do backend (agrupados, filtrados, agregados)
    // Não há mais lógica de filtragem ou agrupamento aqui. Apenas exibição.

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
            // Verifica se é um registro sem horário marcado
            const registroSemHora = registro.Inicio === '00:00' && registro.Fim === '00:00';
            const horarioStyle = registroSemHora ? 'color: #6c757d; font-style: italic;' : '';
            
            row.innerHTML = `
                <td>${registro.Funcao}</td>
                <td style="${horarioStyle}">${registroSemHora ? 'Sem horário' : registro.Inicio}</td>
                <td style="${horarioStyle}">${registroSemHora ? 'Sem horário' : registro.Fim}</td>
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

    // Funções de exibição abaixo usam apenas dados já processados do backend (agrupados, filtrados, agregados)
    // Não há mais lógica de filtragem ou agrupamento aqui. Apenas exibição.

    // Ordena as funções por quantidade de registros (decrescente)
    funcoes.sort((a, b) => b.quantidade_registros - a.quantidade_registros);

    funcoes.forEach(funcao => {
        const funcaoElement = document.createElement("div");
        funcaoElement.className = "resumo-item";
        
        // Verifica se existem registros sem tempo
        const temRegistrosSemTempo = funcao.registros_sem_tempo > 0;
        const mediaTexto = temRegistrosSemTempo 
            ? `${funcao.media_por_hora}/h (${funcao.registros_sem_tempo} reg. sem horário)`
            : `${funcao.media_por_hora}/h`;

        funcaoElement.innerHTML = `
            <h3>${funcao.funcao}</h3>
            <div class="funcao-detalhes">
                <p>Total Produzido: <span>${funcao.total}</span></p>
                <p>Horas Trabalhadas: <span>${funcao.total_horas}</span></p>
                <p>Média/Hora: <span>${mediaTexto}</span></p>
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

    if (!Array.isArray(dados) || dados.length === 0) {
        document.getElementById("totalDias").textContent = "--";
        document.getElementById("totalRegistros").textContent = "--";
        document.getElementById("mediaGeral").textContent = "--";
        document.getElementById("mediaPorDia").textContent = "--";
        return;
    }

    const totalDias = dados.length;
    const totalRegistros = dados.reduce((acc, grupo) => acc + grupo.registros.length, 0);
    const totalQuantidade = dados.reduce((acc, grupo) => 
        acc + grupo.registros.reduce((sum, registro) => sum + registro.Quantidade, 0), 0);
    
    const mediaGeral = totalRegistros > 0 ? (totalQuantidade / totalRegistros) : 0;
    const mediaPorDia = totalDias > 0 ? (totalQuantidade / totalDias) : 0;

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
