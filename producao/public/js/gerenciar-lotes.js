// Carrega as remessas ao iniciar a página
window.onload = () => {
    console.log("[LOG] Página carregada. Iniciando carregamento de remessas...");
    carregarRemessas();
};

// Função para carregar as remessas do servidor
async function carregarRemessas() {
    console.log("[LOG] Iniciando carregamento das remessas...");

    try {
        const resposta = await fetch("/producao/remessas");
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar remessas: ${resposta.statusText}`);
        }

        const dados = await resposta.json();
        console.log("[LOG] Remessas carregadas com sucesso:", dados);

        atualizarTabelaRemessas(dados.remessas);
        atualizarDropdownRemessas(dados.remessas);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar remessas:", error);
        alert("Erro ao carregar as remessas.");
    }
}

// Função para formatar a data de uma forma mais legível
function formatarData(dataISO) {
    if (!dataISO) return '-';
    const data = new Date(dataISO);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}`;
}

// Função para atualizar a tabela de remessas
function atualizarTabelaRemessas(remessas) {
    console.log("[LOG] Atualizando tabela de remessas...");

    const tbody = document.getElementById("tabelaRemessas").getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; // Limpa a tabela

    remessas.forEach(remessa => {
        const lotesQuantidades = {};
        if (remessa.lotes) {
            remessa.lotes.forEach(lote => {
                const tamanho = lote.tamanho;
                if (!lotesQuantidades[tamanho]) {
                    lotesQuantidades[tamanho] = 0;
                }
                lotesQuantidades[tamanho] += parseInt(lote.quantidade);
            });
        }

        // Cria a linha principal da remessa
        const rowRemessa = tbody.insertRow();
        rowRemessa.classList.add('remessa-row');
        rowRemessa.insertCell(0).textContent = formatarData(remessa.dataRegistro);
        rowRemessa.insertCell(1).textContent = remessa.descricao;

        // Cria uma célula para o total por tamanho
        const totalCell = rowRemessa.insertCell(2);
        const totais = Object.entries(lotesQuantidades)
            .map(([tamanho, total]) => `${tamanho}: ${total}`)
            .join(' | ');
        totalCell.textContent = totais || 'Sem lotes';

        // Adiciona botão para expandir/recolher
        const actionCell = rowRemessa.insertCell(3);
        if (remessa.lotes && remessa.lotes.length > 0) {
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = '▼';
            toggleBtn.className = 'btn btn-sm btn-outline-primary';
            toggleBtn.onclick = () => toggleLotes(remessa.id);
            actionCell.appendChild(toggleBtn);
        }

        // Cria uma linha oculta para os detalhes dos lotes
        if (remessa.lotes && remessa.lotes.length > 0) {
            const rowDetalhes = tbody.insertRow();
            rowDetalhes.id = `lotes-${remessa.id}`;
            rowDetalhes.style.display = 'none';
            const cellDetalhes = rowDetalhes.insertCell(0);
            cellDetalhes.colSpan = 4;
            
            // Cria uma tabela interna para os lotes
            const tabelaLotes = document.createElement('table');
            tabelaLotes.className = 'table table-sm';
            tabelaLotes.innerHTML = `
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Tamanho</th>
                        <th>Quantidade</th>
                    </tr>
                </thead>
                <tbody>
                    ${remessa.lotes.map(lote => `
                        <tr>
                            <td>${lote.tamanho}${lote.numero}</td>
                            <td>${lote.tamanho}</td>
                            <td>${lote.quantidade}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            cellDetalhes.appendChild(tabelaLotes);
        }
    });
}

// Função para expandir/recolher os detalhes dos lotes
function toggleLotes(remessaId) {
    const rowDetalhes = document.getElementById(`lotes-${remessaId}`);
    if (rowDetalhes) {
        const isHidden = rowDetalhes.style.display === 'none';
        rowDetalhes.style.display = isHidden ? 'table-row' : 'none';
        const btn = rowDetalhes.previousElementSibling.querySelector('button');
        if (btn) {
            btn.textContent = isHidden ? '▲' : '▼';
        }
    }
}

// Função para atualizar o dropdown de remessas
function atualizarDropdownRemessas(remessas) {
    console.log("[LOG] Atualizando dropdown de remessas...");

    const select = document.getElementById("remessaSelect");
    select.innerHTML = '<option value="">Selecione uma remessa</option>';

    remessas.forEach(remessa => {
        const option = document.createElement("option");
        option.value = remessa.id;
        option.textContent = `${remessa.descricao} (${formatarData(remessa.dataRegistro)})`;
        select.appendChild(option);
    });
}

// Adiciona evento para o formulário de remessa
document.getElementById("remessaForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("[LOG] Formulário de remessa submetido");

    const descricao = document.getElementById("descricaoRemessa").value;
    const dataRecebimento = document.getElementById("dataRecebimento").value;

    try {
        const resposta = await fetch("/producao/remessas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descricao, dataRecebimento })
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao adicionar remessa: ${resposta.statusText}`);
        }

        const resultado = await resposta.json();
        console.log("[LOG] Remessa adicionada com sucesso:", resultado);
        
        alert("Remessa registrada com sucesso!");
        document.getElementById("remessaForm").reset();
        carregarRemessas(); // Recarrega a lista de remessas
    } catch (error) {
        console.error("[ERRO] Falha ao adicionar remessa:", error);
        alert("Erro ao registrar a remessa.");
    }
});

// Adiciona evento para o formulário de lote
document.getElementById("loteForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("[LOG] Formulário de lote submetido");

    const remessaId = document.getElementById("remessaSelect").value;
    const tamanho = document.getElementById("tamanho").value;
    const quantidade = document.getElementById("quantidade").value;

    if (!remessaId) {
        alert("Selecione uma remessa!");
        return;
    }

    try {
        const resposta = await fetch(`/producao/remessas/${remessaId}/lotes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tamanho, quantidade })
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao adicionar lote: ${resposta.statusText}`);
        }

        const resultado = await resposta.json();
        console.log("[LOG] Lote adicionado com sucesso:", resultado);
        
        alert("Lote adicionado com sucesso!");
        document.getElementById("loteForm").reset();
        carregarRemessas(); // Recarrega a lista de remessas
    } catch (error) {
        console.error("[ERRO] Falha ao adicionar lote:", error);
        alert("Erro ao adicionar o lote.");
    }
});