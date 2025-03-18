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