const nameInput = document.getElementById('name');
const birthdayInput = document.getElementById('date');
const idUser = localStorage.getItem('idUser');

async function fetchUserDetails(id) {
    try {
        const response = await fetch(`http://localhost:3333/user/email/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta: ${response.status}`);
        }

        const data = await response.json();
        nameInput.value = data.nome || "Nome Indefinido";
        birthdayInput.value = data.data_nasc || "";
    } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
    }
}

async function updateUserBirthday(id, birthday) {
    try {
        const response = await fetch(`http://localhost:3333/birthday/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data_nasc: birthday }),
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar a data de nascimento: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data de nascimento atualizada com sucesso:', data);
        alert('Data de nascimento atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar a data de nascimento do usuário:', error);
    }
}

async function updateUserName(id, name) {
    try {
        const response = await fetch(`http://localhost:3333/user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: name }),
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar o nome: ${response.status}`);
        }

        const data = await response.json();
        console.log('Nome atualizado com sucesso:', data);
        alert('Nome atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar o nome do usuário:', error);
    }
}

document.getElementById('salvar').addEventListener('click', function () {
    const newBirthday = birthdayInput.value.trim();
    const newName = nameInput.value.trim();
    const id = localStorage.getItem('idUser');

    if (newBirthday) {
        updateUserBirthday(id, newBirthday);
    } else {
        console.warn('A data de nascimento não pode ser vazia.');
    }

    if (newName) {
        updateUserName(id, newName);
    } else {
        console.warn('O nome não pode ser vazio.');
    }
});

//denuncia
document.addEventListener('DOMContentLoaded', () => {
    // Evento do botão de denúncia
    document.getElementById('denuncia-button').addEventListener('click', function() {
        const modalDenuncia = document.getElementById('modal-denuncia');
        if (modalDenuncia) {
            modalDenuncia.style.display = 'block';
        }
    });

    // Evento de fechar (agora genérico para todos os modais)
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    if (idUser) {
        fetchUserDetails(idUser);
    }
});



// Modo Gravidez - Adicione estas funções
async function activatePregnancyMode(userId) {
    try {
        const response = await fetch(`http://localhost:3333/user/pregnancy/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pregnancy_mode: true })
        });

        if (!response.ok) {
            throw new Error(`Erro ao ativar modo gravidez: ${response.status}`);
        }

        const data = await response.json();
        console.log('Modo gravidez ativado com sucesso:', data);
        alert('Modo gravidez ativado com sucesso!');
        // Redirecionar ou atualizar a interface conforme necessário
        window.location.href = '../gravidez/gravidez.html'; // Adapte para sua rota
    } catch (error) {
        console.error('Erro ao ativar modo gravidez:', error);
        alert('Erro ao ativar modo gravidez');
    }
}

// Evento para o botão de confirmação no modal
document.getElementById('acionar-gravidez').addEventListener('click', function() {
    const modalGravidez = document.getElementById('modal-gravidez');
    if (modalGravidez) {
        modalGravidez.style.display = 'flex';
    }
});
// Evento para abrir o modal de gravidez (já existe no seu HTML)
document.getElementById('acionar-gravidez').addEventListener('click', function() {
    document.getElementById('modal-gravidez').style.display = 'flex';
});

// Fechar modal ao clicar no X (melhoria para todos os modais)
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Fechar modal ao clicar fora do conteúdo
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
});

