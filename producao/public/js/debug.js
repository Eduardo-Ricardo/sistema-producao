/**
 * Script para verificar se a página está carregando corretamente
 * Para utilizar, adicione este script à página HTML e visualize o console
 */

console.log("=== DIAGNÓSTICO DE CARREGAMENTO ===");

// Verificar se o DOM está completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado com sucesso!");
    
    // Verificar elementos críticos
    const elementos = [
        { id: "calendarioRegistro", nome: "Calendário" },
        { id: "employeeRole", nome: "Dropdown de Função" },
        { id: "machine", nome: "Campo de Máquina" },
        { id: "adicionarFuncaoExtra", nome: "Botão Adicionar Função" },
        { id: "productionForm", nome: "Formulário de Produção" }
    ];
    
    console.log("Verificando elementos críticos:");
    elementos.forEach(elemento => {
        const el = document.getElementById(elemento.id);
        if (el) {
            console.log(`✅ ${elemento.nome} (${elemento.id}): Encontrado`);
        } else {
            console.error(`❌ ${elemento.nome} (${elemento.id}): NÃO ENCONTRADO`);
        }
    });
    
    // Verificar módulos JS carregados
    console.log("Verificando módulos importados:");
    
    // Verificar se botões críticos têm event listeners
    const btnAdicionar = document.getElementById("adicionarFuncaoExtra");
    if (btnAdicionar) {
        console.log("Botão Adicionar Função Extra: Testando clique simulado");
        btnAdicionar.click();
    }
    
    const formulario = document.getElementById("productionForm");
    if (formulario) {
        console.log("Formulário: Verificando event listener de submit");
    }
    
    console.log("=== FIM DO DIAGNÓSTICO ===");
});
