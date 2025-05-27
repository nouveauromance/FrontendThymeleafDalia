document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar');
    const idUser = localStorage.getItem('idUser');
    const registrarBtn = document.getElementById('registrar-menstruacao');
    const fimMenstruacaoBtn = document.getElementById('fim-menstruacao');

    if (!idUser) {
        console.error('ID do usuário não encontrado na localStorage.');
        return;
    }

    let menstruacaoAtiva = false; 
    let eventos = []; 

    try {
        const response = await fetch(`http://localhost:3333/menstruation/${idUser}`);
        const menstruationData = await response.json();

        if (menstruationData.length > 0) {
            const { ultimo_dia_menstruacao, duracao_ciclo } = menstruationData[0];
            const dataUltimaMenstruacao = new Date(ultimo_dia_menstruacao);
            const duracaoCiclo = duracao_ciclo || 28;

            eventos = calcularPeriodos(dataUltimaMenstruacao, duracaoCiclo);
            renderizarCalendario(eventos);

            registrarBtn.addEventListener('click', function () {
                if (!menstruacaoAtiva) {
                    const hoje = new Date();
                    const fimMenstruacao = new Date(hoje);
                    fimMenstruacao.setDate(hoje.getDate() + 4); 

                    
                    eventos.push({
                        title: 'Menstruação',
                        start: hoje.toISOString().split('T')[0],
                        end: hoje.toISOString().split('T')[0], 
                        color: '#e57373',
                        rendering: 'background',
                        allDay: true
                    });

                    menstruacaoAtiva = true;
                    fimMenstruacaoBtn.style.display = 'block';
                }

                atualizarPrevisoes();
                renderizarCalendario(eventos); 
            });

            fimMenstruacaoBtn.addEventListener('click', function () {
                if (menstruacaoAtiva) {

                    eventos = eventos.filter(event => event.title !== 'Menstruação');
                    menstruacaoAtiva = false; 
                    fimMenstruacaoBtn.style.display = 'none';

                    const hoje = new Date();
                    const duracaoCiclo = 28;
                    const novaMenstruacao = new Date(hoje);
                    const fimMenstruacao = new Date(novaMenstruacao);
                    fimMenstruacao.setDate(novaMenstruacao.getDate() + 4);

                    eventos.push({
                        title: 'Menstruação',
                        start: novaMenstruacao.toISOString().split('T')[0],
                        end: novaMenstruacao.toISOString().split('T')[0],
                        color: '#e57373',
                        rendering: 'background',
                        allDay: true
                    });

                    atualizarPrevisoes(novaMenstruacao, duracaoCiclo);
                }

                renderizarCalendario(eventos);
            });

        } else {
            console.log("Nenhum dado de menstruação encontrado para o usuário.");
        }
    } catch (error) {
        console.error('Erro ao buscar os dados de menstruação:', error);
    }

    function renderizarCalendario(eventos) {
        calendarEl.innerHTML = '';

        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'pt-br',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
            },
            events: eventos,
            eventDidMount: function (info) {
                info.el.style.fontWeight = 'bold';
            }
        });

        calendar.render();
    }

    function calcularPeriodos(dataUltimaMenstruacao, duracaoCiclo) {
        const eventos = [];
        let cicloAtual = new Date(dataUltimaMenstruacao);

        for (let i = 0; i < 12; i++) {
            const dataProximaMenstruacao = new Date(cicloAtual);
            const fimMenstruacao = new Date(dataProximaMenstruacao);
            fimMenstruacao.setDate(fimMenstruacao.getDate() + 4);

            eventos.push({
                title: 'Menstruação',
                start: dataProximaMenstruacao.toISOString().split('T')[0],
                end: fimMenstruacao.toISOString().split('T')[0],
                color: '#e57373',
                rendering: 'background',
                allDay: true
            });

            const ovulacao = new Date(dataProximaMenstruacao);
            ovulacao.setDate(ovulacao.getDate() + Math.floor(duracaoCiclo / 2));

            eventos.push({
                title: 'Ovulação',
                start: ovulacao.toISOString().split('T')[0],
                color: '#83ce8f',
                allDay: true
            });

            const inicioFertil = new Date(ovulacao);
            inicioFertil.setDate(inicioFertil.getDate() - 5);
            const fimFertil = new Date(ovulacao);
            fimFertil.setDate(fimFertil.getDate() + 2);

            eventos.push({
                title: 'Fase Fértil',
                start: inicioFertil.toISOString().split('T')[0],
                end: fimFertil.toISOString().split('T')[0],
                color: '#74c7eb',
                allDay: true
            });

            cicloAtual.setDate(cicloAtual.getDate() + duracaoCiclo);
        }

        return eventos;
    }

    function atualizarPrevisoes(dataInicio, duracaoCiclo) {
        eventos = calcularPeriodos(dataInicio || new Date(), duracaoCiclo || 28);
    }
});
