/**
 * Atualiza a tabela de produção exibida na página visualizar.html com os dados fornecidos.
 * 
 * @param {Array} dados - Array de objetos contendo os dados de produção a serem exibidos.
 * Cada objeto deve conter as propriedades: employeeName, employeeRole, startTime, endTime, productionCount, productionDate.
 */
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

/**
 * Atualiza o dropdown de funções na tela registrar.html com as funções disponíveis no machineMap.
 * 
 * @param {Object} machineMap - Objeto contendo as funções disponíveis organizadas por seção ou em formato plano.
 * O formato pode ser antigo (objeto plano) ou novo (objeto estruturado por seções).
 */
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

/**
 * Configura o evento para atualizar o campo de máquina com base na função selecionada pelo usuário.
 * 
 * @param {Object} machineMap - Objeto contendo as máquinas disponíveis para cada função.
 * O formato pode ser antigo (objeto plano) ou novo (objeto estruturado por seções).
 */
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

/**
 * Adiciona uma nova opção ao dropdown de funções na tela registrar.html.
 * 
 * @param {string} funcao - O nome da nova função a ser adicionada ao dropdown.
 */
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

/**
 * Captura uma nova função e máquina do usuário através de prompts e retorna um objeto com essas informações.
 * O formato do objeto retornado depende do formato do machineMap (antigo ou novo).
 * 
 * @param {Object} machineMap - Objeto contendo as máquinas disponíveis para cada função.
 * O formato pode ser antigo (objeto plano) ou novo (objeto estruturado por seções).
 * @returns {Object|null} Um objeto contendo a função e máquina capturadas, ou null se a operação foi cancelada ou os dados são inválidos.
 */
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


/**
 * Preenche a tabela de dados do funcionário na página ficha-funcionario.html com os dados fornecidos.
 * 
 * @param {Object} dados - Objeto contendo os dados do funcionário, incluindo registros de produção.
 * Deve conter as propriedades: registros (array de registros de produção) e funcoes (array de funções únicas).
 */
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


/**
 * Preenche o grid de funções únicas na página ficha-funcionario.html com os dados fornecidos.
 * 
 * @param {Array} funcoes - Array de objetos contendo os dados das funções únicas a serem exibidas.
 * Cada objeto deve conter as propriedades: funcao, total, total_horas, media_por_hora, registros_sem_tempo, quantidade_registros.
 */
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

/**
 * Calcula e exibe o resumo dos dados do funcionário, incluindo totais e médias, na página ficha-funcionario.html.
 * 
 * @param {Array} dados - Array de objetos contendo os dados de produção do funcionário.
 * Cada objeto deve conter uma propriedade registros, que é um array de registros de produção.
 */
export function calcularResumoFuncionario(dados) {
    console.log("[LOG] Iniciando cálculo do resumo dos dados do funcionário...");

    // Função auxiliar para atualizar elemento com segurança
    function atualizarElemento(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
        } else {
            console.warn(`[AVISO] Elemento #${id} não encontrado`);
        }
    }

    if (!Array.isArray(dados) || dados.length === 0) {
        atualizarElemento("diasTrabalhados", "--");
        atualizarElemento("funcoesModa", "--");
        atualizarElemento("mediaPorDia", "--");
        atualizarElemento("mediaPorHora", "--");
        atualizarElemento("diasUteis", "--");
        atualizarElemento("finaisSemana", "--");
        return;
    }

    const totalDias = dados.length;
    const totalRegistros = dados.reduce((acc, grupo) => acc + grupo.registros.length, 0);
    const totalQuantidade = dados.reduce((acc, grupo) => 
        acc + grupo.registros.reduce((sum, registro) => sum + registro.Quantidade, 0), 0);
    
    const mediaGeral = totalRegistros > 0 ? (totalQuantidade / totalRegistros) : 0;
    const mediaPorDia = totalDias > 0 ? (totalQuantidade / totalDias) : 0;
    
    // Calcular dias úteis e fins de semana
    const diasUteis = dados.filter(grupo => {
        const data = new Date(grupo.date);
        const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado
        return diaSemana > 0 && diaSemana < 6;
    }).length;
    
    const finaisSemana = totalDias - diasUteis;    // Calcular funções mais frequentes (moda)
    const contagemFuncoes = {};
    dados.forEach(grupo => {
        grupo.registros.forEach(registro => {
            const funcao = registro.Funcao;
            contagemFuncoes[funcao] = (contagemFuncoes[funcao] || 0) + 1;
        });
    });
    
    // Transformar em array e ordenar por frequência (decrescente)
    const funcoesOrdenadas = Object.entries(contagemFuncoes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3) // Pegar as 3 principais
        .map(([funcao, qtd]) => `<div class="funcao-linha">${funcao} <span class="badge bg-secondary">${qtd}</span></div>`);
    
    // Atualizar elementos no DOM com formatação para tabela
    atualizarElemento("diasTrabalhados", totalDias);
    atualizarElemento("mediaPorDia", mediaPorDia.toFixed(2));
    atualizarElemento("mediaPorHora", (mediaPorDia / 8).toFixed(2)); // Assumindo jornada de 8h
    atualizarElemento("diasUteis", diasUteis);
    atualizarElemento("finaisSemana", finaisSemana);
    atualizarElemento("funcoesModa", funcoesOrdenadas.join("") || "<em>Sem dados</em>");console.log("[LOG] Resumo dos dados do funcionário calculado com sucesso.");
}

// Mostra ou esconde mensagem de erro de validação
/**
 * Exibe ou esconde mensagens de validação para o usuário
 * @param {HTMLElement} elemento - O elemento HTML onde a mensagem será exibida/escondida
 * @param {string|null} mensagem - A mensagem de erro a ser exibida, ou null para esconder
 */
export function mostrarErroValidacao(elemento, mensagem = null) {
    if (!elemento) return;
    
    if (mensagem) {
        elemento.textContent = mensagem;
        elemento.style.display = "block";
    } else {
        elemento.textContent = "";
        elemento.style.display = "none";
    }
}


/**
 * Preenche o dropdown de seleção de funcionários com os nomes dos funcionários disponíveis.
 * 
 * @param {Array} nomes - Array de strings contendo os nomes dos funcionários a serem exibidos no dropdown.
 */
export function preencherDropdownFuncionarios(nomes) {
    console.log("[LOG] Preenchendo dropdown de funcionários...");

    // Primeiro tentamos preencher o datalist (para autocomplete)
    const datalist = document.getElementById("listaFuncionarios");
    if (datalist) {
        datalist.innerHTML = "";
        nomes.forEach(nome => {
            const option = document.createElement("option");
            option.value = nome;
            datalist.appendChild(option);
        });
    }

    // Depois preenchemos o dropdown de seleção
    const selectPessoa = document.getElementById("selecaoPessoa");
    if (!selectPessoa) {
        console.warn("[AVISO] Dropdown de funcionários (select) não encontrado.");
        return;
    }

    // Preservar a opção padrão
    const defaultOption = selectPessoa.options[0];
    selectPessoa.innerHTML = "";
    selectPessoa.appendChild(defaultOption);

    // Adiciona os nomes ao dropdown
    nomes.forEach(nome => {
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        selectPessoa.appendChild(option);
    });

    console.log(`[LOG] Dropdown preenchido com ${nomes.length} funcionários`);
}

// Captura os dados do formulário de produção
/**
 * Captura os dados do formulário de produção e retorna um objeto com esses dados.
 * 
 * @returns {Object|null} Um objeto contendo os dados do formulário (employeeName, employeeRole, machine, startTime, endTime, productionCount, productionDate),
 * ou null se os dados são inválidos.
 */
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


/**
 * Limpa os campos do formulário de produção, definindo seus valores padrão.
 */
export function limparCamposFormulario() {
    console.log("[LOG] Limpando os campos do formulário...");
    document.getElementById("employeeRole").value = "";
    document.getElementById("machine").value = "";
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("productionCount").value = "";
}
