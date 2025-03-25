// Função para carregar os dados com filtros
function carregarDados() {
    console.log("[LOG] Iniciando o carregamento dos dados com filtros...");

    const employeeNameElement = document.getElementById("employeeName");
    const employeeRoleElement = document.getElementById("employeeRole");
    const dayElement = document.getElementById("day");
    const monthElement = document.getElementById("month");

    // Verifica se os elementos existem antes de acessar seus valores
    if (!employeeNameElement || !employeeRoleElement || !dayElement || !monthElement) {
        console.warn("[AVISO] Elementos necessários não encontrados na página.");
        return;
    }

    const employeeName = employeeNameElement.value;
    const employeeRole = employeeRoleElement.value;
    const day = dayElement.value;
    const month = monthElement.value;

    console.log("[LOG] Filtros capturados:", { employeeName, employeeRole, day, month });

    const queryParams = new URLSearchParams({
        employeeName,
        employeeRole,
        day,
        month
    });

    fetch(`/producao/dados?${queryParams.toString()}`) 
        .then(resposta => {
            console.log("[LOG] Resposta recebida do servidor:", resposta);
            return resposta.json();
        })
        .then(dados => {
            console.log("[LOG] Dados recebidos do servidor:", dados);

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

            console.log("[LOG] Dados carregados na tabela com sucesso.");
        })
        .catch(error => {
            console.error("[ERRO] Falha ao carregar os dados:", error);
        });
}

// Carregar os dados assim que a página for aberta
window.onload = () => {
    console.log("[LOG] Página carregada. Iniciando carregamento de dados...");
    carregarDados();
    // Carrega o machineMap ao iniciar a página
    carregarMachineMap();
};

// Inicializa o machineMap como um objeto vazio
let machineMap = {}; // Inicializa como um objeto vazio

// Função para carregar o machineMap do servidor
async function carregarMachineMap() {
    console.log("[LOG] Iniciando o carregamento do machineMap...");

    try {
        const resposta = await fetch("/producao/carregarMachineMap"); 
        if (resposta.ok) {
            machineMap = await resposta.json();
            console.log("[LOG] Machine map carregado do servidor:", machineMap);

            // Atualiza o dropdown de funções com os dados carregados
            const employeeRoleSelect = document.getElementById("employeeRole");
            Object.keys(machineMap).forEach(funcao => {
                const opcao = document.createElement("option");
                opcao.value = funcao;
                opcao.textContent = funcao;
                employeeRoleSelect.appendChild(opcao);
            });

            console.log("[LOG] Dropdown de funções atualizado com sucesso.");
        } else {
            console.error("[ERRO] Falha ao carregar o machineMap do servidor.");
        }
    } catch (error) {
        console.error("[ERRO] Erro ao carregar o machineMap:", error);
    }
}

// Atualiza a máquina automaticamente ao selecionar a função
document.getElementById("employeeRole")?.addEventListener("change", function () {
    const selectedFunction = this.value;
    console.log("[LOG] Função selecionada:", selectedFunction);

    const machine = machineMap[selectedFunction] || "Máquina não especificada";
    document.getElementById("machine").value = machine;

    console.log("[LOG] Máquina atualizada para:", machine);
});

// Função para adicionar uma nova função e vinculá-la a uma máquina
function adicionarFuncao() {
    console.log("[LOG] Iniciando o processo de adição de uma nova função...");

    const novaFuncao = prompt("Digite o nome da nova função:");
    if (!novaFuncao) {
        console.warn("[AVISO] Nenhuma função foi adicionada.");
        return alert("A função não pode ser vazia!");
    }

    let novaMaquina = null;

    while (!novaMaquina) {
        novaMaquina = prompt(`Digite o nome da máquina para a função "${novaFuncao}":\nOu deixe vazio para usar "Máquina não especificada".`);
        if (novaMaquina === null) {
            console.warn("[AVISO] Operação cancelada pelo usuário.");
            return alert("Operação cancelada. Nenhuma função foi adicionada.");
        } else if (novaMaquina.trim() === "") {
            novaMaquina = "Máquina não especificada";
        }
    }

    console.log("[LOG] Nova função e máquina capturadas:", { novaFuncao, novaMaquina });

    // Adiciona a nova função ao machineMap
    machineMap[novaFuncao] = novaMaquina;

    // Atualiza o servidor com o novo machineMap
    fetch("/producao/salvarMachineMap", { // Corrigido o caminho
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(machineMap),
    }).then(resposta => {
        if (resposta.ok) {
            console.log("[LOG] Nova função salva no servidor com sucesso.");

            // Atualiza o dropdown de funções
            const employeeRoleSelect = document.getElementById("employeeRole");
            const novaOpcao = document.createElement("option");
            novaOpcao.value = novaFuncao;
            novaOpcao.textContent = novaFuncao;
            employeeRoleSelect.appendChild(novaOpcao);

            alert(`Função "${novaFuncao}" vinculada à máquina "${novaMaquina}" adicionada com sucesso!`);
        } else {
            console.error("[ERRO] Falha ao salvar a nova função no servidor.");
            alert("Erro ao salvar a nova função no servidor!");
        }
    }).catch(error => {
        console.error("[ERRO] Falha ao salvar o machineMap no servidor:", error);
        alert("Erro ao salvar a nova função no servidor!");
    });
}

// Adiciona o evento ao botão de adicionar função
document.getElementById("adicionarFuncao")?.addEventListener("click", adicionarFuncao);

// Captura e envia os dados do formulário para o servidor
document.getElementById("productionForm")?.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita o recarregamento da página

    console.log("[LOG] Capturando os dados do formulário...");

    // Captura os dados do formulário
    const employeeName = document.getElementById("employeeName").value;
    const employeeRole = document.getElementById("employeeRole").value;
    const machine = document.getElementById("machine").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const productionDate = document.getElementById("productionDate").value;

    // Avalia a expressão no campo de quantidade produzida
    let productionCount = document.getElementById("productionCount").value;

    try {
        productionCount = eval(productionCount.replace(/[^0-9+\-*/().]/g, ""));
        console.log("[LOG] Quantidade produzida calculada:", productionCount);

        if (isNaN(productionCount)) {
            throw new Error("A expressão de quantidade produzida é inválida.");
        }
    } catch (error) {
        console.error("[ERRO] Falha ao calcular a quantidade produzida:", error);
        alert("Erro: A expressão de quantidade produzida é inválida.");
        return;
    }

    console.log("[LOG] Dados a serem enviados:", { employeeName, employeeRole, machine, startTime, endTime, productionCount, productionDate });

    // Envia os dados para o servidor via Fetch API
    const resposta = await fetch("/producao/salvar", { // Corrigido o caminho
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeName, employeeRole, machine, startTime, endTime, productionCount, productionDate }),
    });

    const resultado = await resposta.json();
    console.log("[LOG] Resposta do servidor:", resultado);

    alert(resultado.message || resultado.error);

    if (resposta.ok) {
        console.log("[LOG] Dados enviados com sucesso. Limpando os campos do formulário...");
        document.getElementById("employeeRole").value = "";
        document.getElementById("machine").value = "";
        document.getElementById("startTime").value = "";
        document.getElementById("endTime").value = "";
        document.getElementById("productionCount").value = "";
    }
});

// Função para buscar e exibir o último registro do funcionário selecionado
async function exibirUltimoRegistro() {
    const employeeName = document.getElementById("employeeName").value;

    console.log("[LOG] Nome do funcionário selecionado:", employeeName);

    if (!employeeName) {
        console.warn("[AVISO] Nenhum funcionário selecionado.");
        document.getElementById("ultimoRegistro").innerHTML = "Selecione um funcionário para ver os registros.";
        return;
    }

    try {
        console.log("[LOG] Enviando requisição para buscar o último registro do funcionário...");
        const resposta = await fetch(`http://localhost:3000/registrosFuncionario?employeeName=${encodeURIComponent(employeeName)}`);
        
        console.log("[LOG] Resposta recebida do servidor:", resposta);

        if (resposta.ok) {
            const registro = await resposta.json();
            console.log("[LOG] Último registro do funcionário:", registro);

            document.getElementById("ultimoRegistro").innerHTML = `
                <strong>Último Registro:</strong><br>
                Função: ${registro.employeeRole}<br>
                Máquina: ${registro.machine || "Não especificada"}<br>
                Início: ${registro.startTime}<br>
                Fim: ${registro.endTime}<br>
                Quantidade: ${registro.productionCount}<br>
                Data: ${registro.productionDate}
            `;
        } else {
            const erro = await resposta.json();
            console.error("[ERRO] Erro retornado pelo servidor:", erro);
            document.getElementById("ultimoRegistro").innerHTML = `<strong>${erro.error}</strong>`;
        }
    } catch (error) {
        console.error("[ERRO] Falha ao buscar o último registro:", error);
        document.getElementById("ultimoRegistro").innerHTML = "<strong>Erro ao buscar o registro do funcionário.</strong>";
    }
}

// Adiciona o evento ao campo de seleção de funcionário
document.getElementById("employeeName")?.addEventListener("change", exibirUltimoRegistro);
