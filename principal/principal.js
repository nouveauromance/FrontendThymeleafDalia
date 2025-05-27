document.addEventListener('DOMContentLoaded', function() {
    const botoesSintomas = document.querySelectorAll(".sintoma");
    const opcoesHumor = document.querySelectorAll(".sentimento input[type='radio']");
    const containerRegistros = document.getElementById("registros-conteudo");
    
    // Objeto para controlar os estados
    const estadoRegistros = {
        sintomas: new Map(),  // Armazena sintomas selecionados
        humor: null           // Armazena o humor selecionado
    };

    // Função para atualizar registros de humor
    function atualizarHumor(valor, texto) {
        // Remove o registro anterior se existir
        if (estadoRegistros.humor) {
            const registroAnterior = document.querySelector(`[data-tipo="humor"]`);
            if (registroAnterior) registroAnterior.remove();
        }
        
        // Cria novo registro
        if (valor) {
            const registro = document.createElement("p");
            registro.textContent = texto;
            registro.dataset.tipo = "humor";
            containerRegistros.appendChild(registro);
            estadoRegistros.humor = valor;
        } else {
            estadoRegistros.humor = null;
        }
    }

    // Eventos para sintomas (seleção múltipla)
    botoesSintomas.forEach(botao => {
        botao.addEventListener("click", function() {
            const valor = this.value;
            
            if (estadoRegistros.sintomas.has(valor)) {
                // Remove se já estiver selecionado
                estadoRegistros.sintomas.get(valor).remove();
                estadoRegistros.sintomas.delete(valor);
                this.classList.remove('selecionado');
            } else {
                // Adiciona novo registro
                const registro = document.createElement("p");
                registro.textContent = this.textContent;
                registro.dataset.tipo = "sintoma";
                registro.dataset.valor = valor;
                containerRegistros.appendChild(registro);
                
                estadoRegistros.sintomas.set(valor, registro);
                this.classList.add('selecionado');
            }
        });
    });

    // Eventos para humor (seleção única)
    opcoesHumor.forEach(opcao => {
        opcao.addEventListener("change", function() {
            if (this.checked) {
                const label = this.parentElement;
                atualizarHumor(this.value, label.textContent.trim());
            }
        });
    });
});