// public/script.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNrtiyg5QupuJbaU2Lm9Bem77eNzgyKuI",
  authDomain: "gambiarra-dos-crias.firebaseapp.com",
  projectId: "gambiarra-dos-crias",
  storageBucket: "gambiarra-dos-crias.firebasestorage.app",
  messagingSenderId: "43350088552",
  appId: "1:43350088552:web:b9f36056c4d4aa330a54dd",
  measurementId: "G-PYDRH5GK43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// URL base da sua Cloud Function. Isso será preenchido após o deploy da função.
// Substitua 'YOUR_REGION' e 'YOUR_PROJECT_ID' pelos valores corretos.
// Exemplo: [https://us-central1-gambiarra-dos-cria.cloudfunctions.net](https://us-central1-gambiarra-dos-cria.cloudfunctions.net)
const FUNCTIONS_BASE_URL = `https://<YOUR_REGION>-<YOUR_PROJECT_ID>.cloudfunctions.net`; // ATUALIZE ESTA LINHA APÓS O DEPLOY DAS FUNÇÕES!

const PRECO_CERVEJA = 5; // Preço por unidade de cerveja

// Elementos do DOM
const nomeInput = document.getElementById('nomeInput');
const cervejasInput = document.getElementById('cervejasInput');
const adicionarBtn = document.getElementById('adicionarBtn');
const participantesTableBody = document.getElementById('participantesTableBody');
const custoTotalSpan = document.getElementById('custoTotal');
const messageBox = document.getElementById('messageBox');

// Função para exibir mensagens ao usuário
function showMessage(message, type = 'error') {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
    if (type === 'error') {
        messageBox.classList.add('bg-red-100', 'text-red-700');
    } else {
        messageBox.classList.add('bg-green-100', 'text-green-700');
    }
    messageBox.classList.remove('hidden');
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 5000); // Esconde a mensagem após 5 segundos
}

// Função para adicionar participante via Cloud Function
async function adicionarParticipante() {
    const nome = nomeInput.value.trim();
    const cervejas = parseInt(cervejasInput.value, 10);

    if (!nome) {
        showMessage('Por favor, insira um nome.');
        return;
    }
    if (isNaN(cervejas) || cervejas < 0) {
        showMessage('Por favor, insira um número válido de cervejas.');
        return;
    }

    try {
        const response = await fetch(`${FUNCTIONS_BASE_URL}/addParticipante`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, cervejas })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao adicionar participante.');
        }

        showMessage('Participante adicionado com sucesso!', 'success');
        nomeInput.value = '';
        cervejasInput.value = '0';
        fetchParticipantes(); // Atualiza a tabela após adicionar
    } catch (error) {
        showMessage('Erro ao adicionar participante: ' + error.message);
        console.error('Erro ao adicionar participante:', error);
    }
}

// Função para remover participante via Cloud Function
async function removerParticipante(id) {
    if (!id) {
        showMessage('ID do participante inválido para remoção.');
        return;
    }
    try {
        const response = await fetch(`${FUNCTIONS_BASE_URL}/removeParticipante`, {
            method: 'POST', // Usamos POST para enviar o ID no corpo
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao remover participante.');
        }

        showMessage('Participante removido com sucesso!', 'success');
        fetchParticipantes(); // Atualiza a tabela após remover
    } catch (error) {
        showMessage('Erro ao remover participante: ' + error.message);
        console.error('Erro ao remover participante:', error);
    }
}


// Função para buscar e exibir participantes via Cloud Function
async function fetchParticipantes() {
    try {
        const response = await fetch(`${FUNCTIONS_BASE_URL}/getParticipantes`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao buscar participantes.');
        }

        const data = await response.json();
        const participantes = data.participantes; // O backend retornará um objeto com a chave 'participantes'

        participantesTableBody.innerHTML = ''; // Limpa a tabela
        let totalCervejas = 0;

        if (participantes && participantes.length > 0) {
            participantes.forEach(participante => {
                const row = participantesTableBody.insertRow();
                row.classList.add('hover:bg-gray-50'); // Efeito hover
                const nomeCell = row.insertCell();
                const cervejasCell = row.insertCell();
                const acoesCell = row.insertCell();

                nomeCell.textContent = participante.nome;
                nomeCell.classList.add('px-4', 'py-2', 'text-sm', 'text-gray-800');
                
                cervejasCell.textContent = participante.cervejas;
                cervejasCell.classList.add('px-4', 'py-2', 'text-sm', 'text-gray-800');
                
                totalCervejas += participante.cervejas;

                const removerBtn = document.createElement('button');
                removerBtn.textContent = 'Remover';
                removerBtn.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white', 'py-1', 'px-3', 'rounded-md', 'text-xs', 'transition', 'duration-300');
                removerBtn.onclick = () => removerParticipante(participante.id);
                acoesCell.classList.add('px-4', 'py-2', 'text-sm');
                acoesCell.appendChild(removerBtn);
            });
        } else {
            const row = participantesTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 3;
            cell.textContent = 'Nenhum participante adicionado ainda.';
            cell.classList.add('px-4', 'py-2', 'text-sm', 'text-gray-500', 'text-center');
        }

        custoTotalSpan.textContent = `R$ ${(totalCervejas * PRECO_CERVEJA).toFixed(2).replace('.', ',')}`;

    } catch (error) {
        showMessage('Erro ao carregar participantes: ' + error.message);
        console.error('Erro ao buscar participantes:', error);
    }
}

// Adiciona listener ao botão
adicionarBtn.addEventListener('click', adicionarParticipante);

// Faz a primeira busca quando a página carrega
document.addEventListener('DOMContentLoaded', fetchParticipantes);

