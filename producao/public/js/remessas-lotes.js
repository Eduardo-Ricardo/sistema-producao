/**
 * Módulo responsável por operações relacionadas a remessas e lotes
 * Centraliza funções de carregamento e manipulação de remessas e lotes
 */

/**
 * Carrega as remessas disponíveis para um dropdown
 * @param {string} [selectorId='remessaSelect'] - ID do elemento select para as remessas
 * @returns {Promise<Array>} As remessas carregadas
 */
export async function carregarRemessasParaDropdown(selectorId = 'remessaSelect') {
    try {
        const resposta = await fetch('/producao/remessas');
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar remessas: ${resposta.statusText}`);
        }
        
        const dados = await resposta.json();
        const remessas = dados.remessas || dados;
        const remessaSelect = document.getElementById(selectorId);
        
        if (remessaSelect) {
            // Limpa opções existentes
            remessaSelect.innerHTML = '<option value="">Selecione a remessa</option>';
            
            // Adiciona as remessas ao dropdown
            remessas.forEach(remessa => {
                const option = document.createElement('option');
                option.value = remessa.id || remessa.codigo;
                option.textContent = remessa.nome || remessa.descricao || remessa.codigo;
                remessaSelect.appendChild(option);
            });
            
            // Adiciona evento para carregar lotes quando uma remessa for selecionada
            remessaSelect.addEventListener('change', async function() {
                await carregarLotesDaRemessa(this.value);
            });
        }
        
        return remessas;
    } catch (error) {
        console.error("[ERRO] Falha ao carregar remessas:", error);
        return [];
    }
}

/**
 * Carrega os lotes de uma remessa específica para um select múltiplo
 * @param {string} remessaId - ID da remessa selecionada
 * @param {string} [selectorId='loteCodigos'] - ID do elemento select para os lotes
 * @returns {Promise<Array>} Os lotes carregados
 */
export async function carregarLotesDaRemessa(remessaId, selectorId = 'loteCodigos') {
    if (!remessaId) {
        const loteSelect = document.getElementById(selectorId);
        if (loteSelect) {
            loteSelect.innerHTML = '';
        }
        return [];
    }
    
    try {
        const resposta = await fetch(`/producao/lotes?remessaId=${encodeURIComponent(remessaId)}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar lotes: ${resposta.statusText}`);
        }
        
        const lotes = await resposta.json();
        const loteSelect = document.getElementById(selectorId);
        
        if (loteSelect) {
            // Limpa opções existentes
            loteSelect.innerHTML = '';
            
            // Adiciona os lotes ao select múltiplo
            lotes.forEach(lote => {
                const option = document.createElement('option');
                option.value = lote.id || lote.codigo;
                option.textContent = lote.codigo;
                loteSelect.appendChild(option);
            });
        }
        
        return lotes;
    } catch (error) {
        console.error("[ERRO] Falha ao carregar lotes da remessa:", error);
        return [];
    }
}

/**
 * Carrega todas as remessas do sistema
 * @returns {Promise<Array>} Lista de todas as remessas
 */
export async function carregarTodasRemessas() {
    try {
        const resposta = await fetch('/producao/remessas');
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar remessas: ${resposta.statusText}`);
        }
        
        const dados = await resposta.json();
        return dados.remessas || dados;
    } catch (error) {
        console.error("[ERRO] Falha ao carregar remessas:", error);
        return [];
    }
}

/**
 * Carrega todos os lotes de uma remessa
 * @param {string} remessaId - ID da remessa
 * @returns {Promise<Array>} Lista de lotes da remessa
 */
export async function carregarLotes(remessaId) {
    if (!remessaId) return [];
    
    try {
        const resposta = await fetch(`/producao/lotes?remessaId=${encodeURIComponent(remessaId)}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar lotes: ${resposta.statusText}`);
        }
        
        return await resposta.json();
    } catch (error) {
        console.error("[ERRO] Falha ao carregar lotes:", error);
        return [];
    }
}
