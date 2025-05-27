new window.VLibras.Widget('https://vlibras.gov.br/app');
AOS.init({
    duration: 1200,
});

var swiper = new Swiper('.swiper-container', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    loop: true,
});