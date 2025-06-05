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
    ScrollReveal().reveal('#cta, .dish, #testimonial_chef, .feedback, .pedido', {
        origin: 'left',
        duration: 2000,
        distance: '20%',
        interval: 200
    });

    // Toggle lateral (sidebar do card)
    $('#card').on('click', function () {
        $('#cart').toggleClass('active');
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
});
