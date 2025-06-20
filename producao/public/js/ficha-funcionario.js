import { preencherTabelaFuncionario, calcularResumoFuncionario, preencherDropdownFuncionarios, mostrarErroValidacao } from "./ui.js";
import { capturarFiltrosFuncionario } from "./filtros.js";
import { carregarDadosFuncionarioBackend, carregarNomesFuncionariosBackend } from "./dados.js";
import { inicializarCalendario } from "./calendario.js";

/**
 * Módulo ficha-funcionario.js
 * Responsável pela inicialização e controle da página de ficha do funcionário.
 * Gerencia o carregamento de dados, validação de formulários e integração com outros módulos.
 */

let dadosAtuais = null;

// Referências aos elementos de filtro
const selectPessoa = document.getElementById("selecaoPessoa");
const btnBuscar = document.getElementById("buscarDados");
const dataInicioInput = document.getElementById("dataInicio");
const dataFimInput = document.getElementById("dataFim");

// Referências aos elementos de loading e erro
const loaderPessoa = document.getElementById("loader-pessoa");
const loaderBusca = document.getElementById("loader-busca");
const erroFuncionario = document.getElementById("erro-funcionario");
const erroData = document.getElementById("erro-data");

/**
 * Função para carregar os nomes dos funcionários ao carregar a página
 * Exibe loading durante o carregamento e trata erros adequadamente
 * @returns {Promise<void>}
 */
async function carregarNomesFuncionarios() {
    // Preparar UI para carregamento
    btnBuscar.disabled = true;
    selectPessoa.disabled = true;
    if (loaderPessoa) loaderPessoa.style.display = "block";
    
    try {
        console.log("[LOG] Carregando nomes dos funcionários...");
        const nomes = await carregarNomesFuncionariosBackend();
        preencherDropdownFuncionarios(nomes);
          console.log(`[LOG] ${nomes.length} funcionários carregados com sucesso`);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar nomes dos funcionários:", error);
        if (erroFuncionario) {
            mostrarErroValidacao(erroFuncionario, "Erro ao carregar a lista de funcionários. Tente recarregar a página.");
        }
    } finally {
        // Restaurar UI após carregamento
        if (loaderPessoa) loaderPessoa.style.display = "none";
        selectPessoa.disabled = false;
        btnBuscar.disabled = false;
    }
}

/**
 * Evento para buscar os dados do funcionário selecionado
 * Realiza validações e dá feedback visual durante o processo
 * @returns {Promise<void>}
 */
btnBuscar.addEventListener("click", async () => {
    // Limpar mensagens de erro anteriores
    if (erroFuncionario) mostrarErroValidacao(erroFuncionario, null);
    if (erroData) mostrarErroValidacao(erroData, null);
    
    // Verificar se funcionário foi selecionado
    if (!selectPessoa.value.trim()) {
        if (erroFuncionario) {
            mostrarErroValidacao(erroFuncionario, "Por favor, selecione um funcionário");
        } else {
            alert("Por favor, selecione um funcionário");
        }
        selectPessoa.focus();
        return;
    }
    
    // Validação de datas
    const dataInicio = dataInicioInput.value;
    const dataFim = dataFimInput.value;
    if (dataInicio && dataFim && dataInicio > dataFim) {
        if (erroData) {
            mostrarErroValidacao(erroData, "Data inicial não pode ser maior que data final");
        } else {
            alert("Data inicial não pode ser maior que data final");
        }
        dataInicioInput.focus();
        return;
    }
    
    // Preparar UI para carregamento
    btnBuscar.disabled = true;
    const btnText = btnBuscar.querySelector(".btn-text");
    if (btnText) btnText.textContent = "Carregando...";
    if (loaderBusca) loaderBusca.style.display = "block";
    
    try {
        // Capturar filtros usando a função do módulo de filtros
        const filtros = capturarFiltrosFuncionario();
        if (!filtros) {
            return;
        }
        
        console.log("[LOG] Buscando dados com filtros:", filtros);
        
        // Buscar dados no backend
        const dados = await carregarDadosFuncionarioBackend(
            filtros.funcionario, 
            filtros.dataInicio, 
            filtros.dataFim
        );
        
        // Se não houver registros, exibir mensagem
        if (!dados || !dados.registros || dados.registros.length === 0) {
            console.warn("[AVISO] Nenhum dado encontrado para os filtros aplicados");
            alert("Nenhum registro encontrado para os filtros aplicados.");
            return;
        }
        
        // Atualizar dados e UI
        console.log("[LOG] Dados carregados com sucesso:", dados);
        dadosAtuais = dados;
        
        // Preencher componentes com os dados
        preencherTabelaFuncionario(dados);
        calcularResumoFuncionario(dados.registros);
        inicializarCalendario(dados.registros);
        
    } catch (error) {
        console.error("[ERRO] Falha ao buscar dados do funcionário:", error);
        alert("Erro ao buscar dados do funcionário. Tente novamente.");    } finally {
        // Restaurar UI após carregamento
        if (btnText) btnText.textContent = "Buscar Dados";
        if (loaderBusca) loaderBusca.style.display = "none";
        btnBuscar.disabled = false;
    }
});

/**
 * Inicializa a página, configurando os listeners e carregando dados iniciais
 */
function inicializarPagina() {
    console.log("[LOG] Inicializando página de ficha do funcionário...");
    
    // Configurar eventos para campos de data
    if (dataInicioInput) {
        dataInicioInput.addEventListener("change", () => {
            if (erroData) mostrarErroValidacao(erroData, null);
            // Se data fim já estiver preenchida, validar
            if (dataFimInput && dataFimInput.value && dataInicioInput.value > dataFimInput.value) {
                if (erroData) {
                    mostrarErroValidacao(erroData, "Data inicial não pode ser maior que data final");
                }
            }
        });
    }
    
    if (dataFimInput) {
        dataFimInput.addEventListener("change", () => {
            if (erroData) mostrarErroValidacao(erroData, null);
            // Se data início já estiver preenchida, validar
            if (dataInicioInput && dataInicioInput.value && dataInicioInput.value > dataFimInput.value) {
                if (erroData) {
                    mostrarErroValidacao(erroData, "Data inicial não pode ser maior que data final");
                }
            }
        });
    }
    
    // Configurar evento para o campo de funcionário
    if (selectPessoa) {
        selectPessoa.addEventListener("input", () => {
            if (erroFuncionario) mostrarErroValidacao(erroFuncionario, null);
        });
    }
    
    // Carregar os nomes dos funcionários
    carregarNomesFuncionarios();
      // Definir data máxima como hoje
    const hoje = new Date();
    const dataHoje = hoje.toISOString().split('T')[0];
    
    if (dataInicioInput) {
        dataInicioInput.max = dataHoje;
        // Definir valores padrão para as datas (mês atual)
        const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
        dataInicioInput.value = primeiroDiaMes;
    }
    
    if (dataFimInput) {
        dataFimInput.max = dataHoje;
        dataFimInput.value = dataHoje;
    }
    
    console.log("[LOG] Página inicializada com sucesso");
}

// Inicializar a página quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", inicializarPagina);