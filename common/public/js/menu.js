// Função para carregar o menu
async function loadMenu() {
    try {
        const response = await fetch('/html/components/menu.html');
        const menuHtml = await response.text();
        
        // Insere o menu no início do body
        const menuContainer = document.createElement('div');
        menuContainer.innerHTML = menuHtml;
        document.body.insertBefore(menuContainer, document.body.firstChild);
        
        // Destaca o item atual do menu
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('.nav-link');
        
        menuLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        console.error('Erro ao carregar o menu:', error);
    }
}

// Carrega o menu quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', loadMenu);