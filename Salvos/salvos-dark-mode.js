// Seleciona os elementos do botão e indicador
const botaoModoNoturno = document.querySelector('.modo-noturno');
const indicador = document.querySelector('.indicador');
const corpo = document.body;

// Se o modo noturno estiver ativado no localStorage, aplica ao carregar
if (localStorage.getItem('modoEscuro') === 'true') {
    corpo.classList.add('modo-escuro');
    botaoModoNoturno.classList.add('ativo');
    aplicarFiltroImagens(true);
}

// Ao clicar no botão, alterna o modo
botaoModoNoturno.addEventListener('click', () => {
    const escuroAtivo = corpo.classList.toggle('modo-escuro');
    botaoModoNoturno.classList.toggle('ativo', escuroAtivo);
    localStorage.setItem('modoEscuro', escuroAtivo);
    aplicarFiltroImagens(escuroAtivo);
});

// Estilos CSS injetados dinamicamente para o modo escuro
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .modo-escuro {
            --fundo: #43393D;
            --botoes: #D9D9D9;
            --botoes-hover: rgb(230, 230, 230);
            --botao-gravidez: #E3C3D8;
            --botao-gravidez-hover: rgb(250, 216, 238);
            --botao-confirmacao: #333;
            --botao-confirmacao-hover: #444;
            color: #fff;
        }

        .modo-escuro h1 {
            border-bottom-color: #fff;
        }

        .modo-escuro .footer {
            background-color: #333;
            color: #fff;
        }

        .modo-escuro svg {
            filter: brightness(0) invert(1); /* transforma SVGs pretos em brancos */
        }
    </style>
`);

// Aplica ou remove o filtro nas imagens (para modo escuro)

function aplicarFiltroImagens(isDark) {
    const imagens = document.querySelectorAll('img:not(.indicador, .no-filter, .no-darkmode)'); // Exclui imagens com .no-darkmode
    imagens.forEach(img => {
        img.style.filter = isDark ? 'brightness(0) invert(1)' : '';
    });
}