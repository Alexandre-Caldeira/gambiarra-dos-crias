// public/script.js - Conteúdo ATUALIZADO para usar o Firestore diretamente

// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from "[https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js](https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js)";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "[https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js](https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js)";

// COLOQUE AQUI O SEU OBJETO firebaseConfig QUE VOCÊ COPIOU DO CONSOLE DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDNrtiyg5QupuJbaU2Lm9Bem77eNzgyKuI", // SEU_API_KEY
  authDomain: "gambiarra-dos-crias.firebaseapp.com", // SEU_AUTH_DOMAIN
  projectId: "gambiarra-dos-crias", // SEU_PROJECT_ID
  storageBucket: "gambiarra-dos-crias.firebasestorage.app", // SEU_STORAGE_BUCKET
  messagingSenderId: "43350088552", // SEU_MESSAGING_SENDER_ID
  appId: "1:43350088552:web:b9f36056c4d4aa330a54dd", // SEU_APP_ID
  measurementId: "G-PYDRH5GK43" // SEU_MEASUREMENT_ID
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

// Função para adicionar participante diretamente no Firestore
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
        await addDoc(collection(db, 'churrasco_beers'), {
            nome: nome,
            cervejas: cervejas,
            timestamp: new Date() // Usar timestamp do cliente para ordenação
        });
        showMessage('Participante adicionado com sucesso!', 'success');
        nomeInput.value = '';
        cervejasInput.value = '0';
        fetchParticipantes(); // Atualiza a tabela após adicionar
    } catch (error) {
        showMessage('Erro ao adicionar participante: ' + error.message);
        console.error('Erro ao adicionar participante:', error);
    }
}

// Função para remover participante diretamente do Firestore
async function removerParticipante(id) {
    if (!id) {
        showMessage('ID do participante inválido para remoção.');
        return;
    }
    try {
        await deleteDoc(doc(db, 'churrasco_beers', id));
        showMessage('Participante removido com sucesso!', 'success');
        fetchParticipantes(); // Atualiza a tabela após remover
    } catch (error) {
        showMessage('Erro ao remover participante: ' + error.message);
        console.error('Erro ao remover participante:', error);
    }
}

// Função para buscar e exibir participantes diretamente do Firestore
async function fetchParticipantes() {
    try {
        const participantesCol = collection(db, 'churrasco_beers');
        const q = query(participantesCol, orderBy('timestamp', 'asc')); // Ordena por timestamp
        const querySnapshot = await getDocs(q);

        participantesTableBody.innerHTML = ''; // Limpa a tabela
        let totalCervejas = 0;

        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const participante = doc.data();
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
                removerBtn.onclick = () => removerParticipante(doc.id); // Usa doc.id para remover
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

