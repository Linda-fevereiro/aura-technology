document.addEventListener('DOMContentLoaded', () => {
    // --- Funcionalidade de Animação (Fade-in ao carregar/rolar) ---

    // Seleciona todas as seções que queremos animar ao entrar no viewport
    const sectionsToAnimate = document.querySelectorAll('.content-section, #hero, .hero-subpage');

    // Opções para o IntersectionObserver
    const observerOptions = {
        root: null, // O viewport é o elemento raiz que estamos observando
        rootMargin: '0px', // Nenhuma margem extra ao redor do viewport
        threshold: 0.1 // A ação é acionada quando 10% do elemento está visível
    };

    // Cria o IntersectionObserver
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Se o elemento está visível, adiciona a classe 'animated' para iniciar a transição
                entry.target.classList.add('animated');
                // Para de observar este elemento, pois ele já foi animado
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Itera sobre cada seção a ser animada
    sectionsToAnimate.forEach(section => {
        // Adiciona a classe 'fade-in' imediatamente para preparar o elemento para a animação
        // Isso define a opacidade inicial em 0 e aplica a transição CSS
        section.classList.add('fade-in');

        // Verifica se o elemento já está no viewport (visível na tela) ao carregar a página
        // Isso resolve o problema comum de elementos "acima da dobra" não animarem
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            // Se já está visível, adiciona a classe 'animated' imediatamente para que ele apareça
            section.classList.add('animated');
        } else {
            // Se não está visível no carregamento, adiciona o IntersectionObserver
            // para animar quando o usuário rolar a página e o elemento entrar no viewport
            observer.observe(section);
        }
    });

    // --- Funcionalidade do Menu Responsivo (Hambúrguer) ---

    // Seleciona o botão de alternar o menu (o ícone hambúrguer)
    const menuToggle = document.querySelector('.menu-toggle');
    // Seleciona a lista de links de navegação
    const navLinks = document.querySelector('.nav-links');

    // Adiciona um listener de evento de clique ao botão hambúrguer
    menuToggle.addEventListener('click', () => {
        // Alterna a classe 'active' na lista de links de navegação.
        // O CSS usa essa classe para mostrar ou esconder o menu.
        navLinks.classList.toggle('active');
        // Alterna a classe 'active' no próprio botão hambúrguer.
        // O CSS usa essa classe para animar o ícone do hambúrguer para um 'X'.
        menuToggle.classList.toggle('active');
    });

    // Fechar o menu ao clicar em um link (melhora a experiência do usuário em mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Se o menu estiver aberto (tiver a classe 'active'), fecha-o
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });
});
// --- Funcionalidade do Carrossel na Página Inicial ---
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    function showSlide(n) {
        // Remove a classe 'active' de todos os slides
        slides.forEach(slide => slide.classList.remove('active'));
        // Adiciona a classe 'active' ao slide atual
        slides[(n + slides.length) % slides.length].classList.add('active');
        currentSlide = (n + slides.length) % slides.length;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Iniciar o carrossel se houver slides
    if (slides.length > 0) {
        showSlide(0); // Mostra o primeiro slide
        setInterval(nextSlide, 3000); // Troca de slide a cada 5 segundos
    }
});