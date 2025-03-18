// Função para carregar os dados com filtros
function carregarDados() {
    const employeeName = document.getElementById("employeeName").value;
    const employeeRole = document.getElementById("employeeRole").value;
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;

    const queryParams = new URLSearchParams({
        employeeName,
        employeeRole,
        day,
        month
    });

    fetch(`http://localhost:3000/dados?${queryParams.toString()}`)
        .then(resposta => resposta.json())
        .then(dados => {
            const tabela = document.getElementById("tabelaProducao").getElementsByTagName("tbody")[0];
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
        });
}

// Carregar os dados assim que a página for aberta
window.onload = carregarDados;

// Inicializa o machineMap como um objeto vazio
let machineMap = {}; // Inicializa como um objeto vazio

// Função para carregar o machineMap do servidor
async function carregarMachineMap() {
    try {
        const resposta = await fetch("http://localhost:3000/carregarMachineMap");
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
        } else {
            console.error("[ERRO] Falha ao carregar o machineMap do servidor.");
        }
    } catch (error) {
        console.error("[ERRO] Erro ao carregar o machineMap:", error);
    }
}

// Carrega o machineMap ao iniciar a página
carregarMachineMap();

// Atualiza a máquina automaticamente ao selecionar a função
document.getElementById("employeeRole")?.addEventListener("change", function () {
    const selectedFunction = this.value;
    document.getElementById("machine").value = machineMap[selectedFunction] || "";
});

// Função para adicionar uma nova função e vinculá-la a uma máquina
function adicionarFuncao() {
    const novaFuncao = prompt("Digite o nome da nova função:");
    if (!novaFuncao) return alert("A função não pode ser vazia!");

    let novaMaquina = null;

    while (!novaMaquina) {
        novaMaquina = prompt(`Digite o nome da máquina para a função "${novaFuncao}":\nOu deixe vazio para usar "Máquina não especificada".`);
        if (novaMaquina === null) {
            // Se o usuário cancelar o prompt
            return alert("Operação cancelada. Nenhuma função foi adicionada.");
        } else if (novaMaquina.trim() === "") {
            // Se o usuário deixar vazio, usar o valor padrão
            novaMaquina = "Máquina não especificada";
        }
    }

    // Adiciona a nova função ao machineMap
    machineMap[novaFuncao] = novaMaquina;

    // Atualiza o servidor com o novo machineMap
    fetch("http://localhost:3000/salvarMachineMap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(machineMap),
    }).then(resposta => {
        if (resposta.ok) {
            // Atualiza o dropdown de funções
            const employeeRoleSelect = document.getElementById("employeeRole");
            const novaOpcao = document.createElement("option");
            novaOpcao.value = novaFuncao;
            novaOpcao.textContent = novaFuncao;
            employeeRoleSelect.appendChild(novaOpcao);

            alert(`Função "${novaFuncao}" vinculada à máquina "${novaMaquina}" adicionada com sucesso!`);
        } else {
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

    // Captura os dados do formulário
    const employeeName = document.getElementById("employeeName").value;
    const employeeRole = document.getElementById("employeeRole").value;
    const machine = document.getElementById("machine").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const productionCount = document.getElementById("productionCount").value;
    const productionDate = document.getElementById("productionDate").value;

    // Exibir os dados no console antes de enviar
    console.log("Dados a serem enviados:", { employeeName, employeeRole, machine, startTime, endTime, productionCount, productionDate });

    // Envia os dados para o servidor via Fetch API
    const resposta = await fetch("http://localhost:3000/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeName, employeeRole, machine, startTime, endTime, productionCount, productionDate }),
    });

    const resultado = await resposta.json();
    console.log("Resposta do servidor:", resultado); // Log da resposta do servidor

    alert(resultado.message || resultado.error);

    if (resposta.ok) {
        this.reset(); // Limpa o formulário após salvar os dados
        document.getElementById("machine").value = ""; // Resetar a máquina também
    }
});