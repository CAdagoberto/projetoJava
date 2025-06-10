$(document).ready(function () {
    // Toggle do menu mobile
    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $(this).find('i').toggleClass('fa-x');
    });

    // Scroll: adiciona sombra no header e ativa item do menu
    const sections = $('section');
    const navItems = $('.nav-item');

    $(window).on('scroll', function () {
        const header = $('header');
        const scrollPosition = $(window).scrollTop() - header.outerHeight();
        let activeSectionIndex = 0;

        if (scrollPosition <= 0) {
            header.css('box-shadow', 'none');
        } else {
            header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1)');
        }

        sections.each(function (i) {
            const sectionTop = $(this).offset().top - 96;
            const sectionBottom = sectionTop + $(this).outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSectionIndex = i;
                return false;
            }
        });

        navItems.removeClass('active');
        $(navItems[activeSectionIndex]).addClass('active');
    });

    // Animações ScrollReveal
    ScrollReveal().reveal('#cta, .dish, #testimonial_chef, .feedback', {
        origin: 'left',
        duration: 2000,
        distance: '20%',
        interval: 200
    });

$('#nav_card').on('click', function () {
    $('.card').toggleClass('active');
});


    // Marca o link ativo no menu com base na URL
    const currentPath = window.location.pathname.replace(/\/+$/, "");
    const currentFile = currentPath.split("/").pop() || "index.html";

    $('.nav-item a').each(function () {
        const linkFile = $(this).attr('href').split("/").pop();

        if (linkFile === currentFile) {
            $(this).parent().addClass('active');
        } else {
            $(this).parent().removeClass('active');
        }
    });


    const recheioSelect = document.getElementById('recheio');
    const image = document.getElementById('product-image');

  recheioSelect.addEventListener('change', () => {
    const valor = recheioSelect.value;
    if (valor) {
      image.src = `../img/Produtos/${valor}.jpg`;
      image.style.display = 'block';
    } else {
      image.src = '';
      image.style.display = 'none';
    }
  });
});
// Agora defina a função FORA do $(document).ready)
function adicionarCarrinho(botao) {
  const card = botao.closest(".dish");

  const nome = card.querySelector(".dish-title").textContent;
  const descricao = card.querySelector(".dish-description").textContent;
  const valor = card.querySelector(".dish-price h4").textContent;

  const produto = { nome, descricao, valor };

  // Salvar no localStorage
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.push(produto);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

}

function atualizarContagemCarrinho() {
  // Pega o item do localStorage
  const carrinhoJSON = localStorage.getItem('carrinho');
  
  // Se não tiver nada, assume array vazio
  const carrinho = carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
  
  // Conta quantos itens tem
  const quantidade = carrinho.length;
  
  // Pega o span dentro do #nav_card e atualiza o texto
  const spanContagem = document.querySelector('#nav_card span');
  if (spanContagem) {
    spanContagem.textContent = quantidade;
  }
}

// Chama a função para atualizar quando a página carregar
window.addEventListener('DOMContentLoaded', atualizarContagemCarrinho);
