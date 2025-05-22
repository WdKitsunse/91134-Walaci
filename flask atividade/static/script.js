// Variáveis globais
let amigos = [];
let amigoEditandoId = null;

// Simular dados iniciais (já que não temos acesso ao backend real)
let proximoId = 1;

// URL base da API (ajuste conforme necessário)
const API_BASE = 'http://localhost:5000/api';

// Função para mostrar alertas
function mostrarAlerta(mensagem, tipo = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alertClass = tipo === 'success' ? 'alert-success' : 'alert-error';
    
    alertContainer.innerHTML = `
        <div class="alert ${alertClass}">
            ${mensagem}
        </div>
    `;

    // Remove o alerta após 3 segundos
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 3000);
}

// Função para fazer requisições HTTP
async function fazerRequisicao(url, opcoes = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...opcoes.headers
            },
            ...opcoes
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// Função para adicionar amigo
async function adicionarAmigo() {
    const nomeInput = document.getElementById('nomeAmigo');
    const nome = nomeInput.value.trim();

    if (!nome) {
        mostrarAlerta('Por favor, digite um nome!', 'error');
        return;
    }

    try {
        // Versão para API real (descomente quando tiver o backend funcionando)
        /*
        const resultado = await fazerRequisicao(`${API_BASE}/adicionar`, {
            method: 'POST',
            body: JSON.stringify({ nome: nome })
        });
        
        mostrarAlerta(resultado.mensagem);
        nomeInput.value = '';
        carregarAmigos();
        */

        // Versão simulada (remova quando usar a API real)
        const novoAmigo = {
            id: proximoId++,
            nome: nome
        };

        amigos.push(novoAmigo);
        nomeInput.value = '';
        
        mostrarAlerta(`Amigo "${nome}" adicionado com sucesso!`);
        carregarAmigos();

    } catch (error) {
        mostrarAlerta('Erro ao adicionar amigo: ' + error.message, 'error');
    }
}

// Função para carregar amigos
async function carregarAmigos() {
    try {
        // Versão para API real (descomente quando tiver o backend funcionando)
        /*
        const amigosData = await fazerRequisicao(`${API_BASE}/listar`);
        amigos = amigosData;
        */

        // Versão simulada (remova quando usar a API real)
        // amigos já está sendo usado da variável global

        const listaAmigos = document.getElementById('listaAmigos');
        
        if (amigos.length === 0) {
            listaAmigos.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 4rem; margin-bottom: 20px;">👥</div>
                    <h3>Nenhum amigo cadastrado</h3>
                    <p>Adicione seu primeiro amigo usando o formulário acima!</p>
                </div>
            `;
            return;
        }

        listaAmigos.innerHTML = amigos.map(amigo => `
            <div class="friend-card">
                <h3>${amigo.nome}</h3>
                <p>ID: ${amigo.id}</p>
                <div class="friend-actions">
                    <button class="btn btn-warning" onclick="editarAmigo(${amigo.id}, '${amigo.nome}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger" onclick="deletarAmigo(${amigo.id}, '${amigo.nome}')">
                        🗑️ Deletar
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        mostrarAlerta('Erro ao carregar amigos: ' + error.message, 'error');
    }
}

// Função para buscar amigos
async function buscarAmigos() {
    const termo = document.getElementById('buscarAmigo').value.toLowerCase().trim();
    const listaAmigos = document.getElementById('listaAmigos');
    
    if (!termo) {
        carregarAmigos();
        return;
    }

    try {
        // Versão para API real (descomente quando tiver o backend funcionando)
        /*
        const amigosFiltrados = await fazerRequisicao(`${API_BASE}/buscar?nome=${encodeURIComponent(termo)}`);
        */

        // Versão simulada (remova quando usar a API real)
        const amigosFiltrados = amigos.filter(amigo => 
            amigo.nome.toLowerCase().includes(termo)
        );

        if (amigosFiltrados.length === 0) {
            listaAmigos.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔍</div>
                    <h3>Nenhum amigo encontrado</h3>
                    <p>Tente buscar com outro termo!</p>
                </div>
            `;
            return;
        }

        listaAmigos.innerHTML = amigosFiltrados.map(amigo => `
            <div class="friend-card">
                <h3>${amigo.nome}</h3>
                <p>ID: ${amigo.id}</p>
                <div class="friend-actions">
                    <button class="btn btn-warning" onclick="editarAmigo(${amigo.id}, '${amigo.nome}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger" onclick="deletarAmigo(${amigo.id}, '${amigo.nome}')">
                        🗑️ Deletar
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        mostrarAlerta('Erro ao buscar amigos: ' + error.message, 'error');
    }
}

// Função para editar amigo
function editarAmigo(id, nome) {
    amigoEditandoId = id;
    document.getElementById('nomeEdicao').value = nome;
    document.getElementById('modalEdicao').style.display = 'block';
}

// Função para salvar edição
async function salvarEdicao() {
    const novoNome = document.getElementById('nomeEdicao').value.trim();
    
    if (!novoNome) {
        mostrarAlerta('Por favor, digite um nome!', 'error');
        return;
    }

    try {
        // Versão para API real (descomente quando tiver o backend funcionando)
        /*
        const resultado = await fazerRequisicao(`${API_BASE}/atualizar/${amigoEditandoId}`, {
            method: 'PUT',
            body: JSON.stringify({ nome: novoNome })
        });
        
        mostrarAlerta(resultado.mensagem);
        carregarAmigos();
        fecharModal();
        */

        // Versão simulada (remova quando usar a API real)
        const amigoIndex = amigos.findIndex(amigo => amigo.id === amigoEditandoId);
        
        if (amigoIndex !== -1) {
            const nomeAnterior = amigos[amigoIndex].nome;
            amigos[amigoIndex].nome = novoNome;
            
            mostrarAlerta(`Amigo "${nomeAnterior}" atualizado para "${novoNome}" com sucesso!`);
            carregarAmigos();
            fecharModal();
        }

    } catch (error) {
        mostrarAlerta('Erro ao atualizar amigo: ' + error.message, 'error');
    }
}

// Função para deletar amigo
async function deletarAmigo(id, nome) {
    if (!confirm(`Tem certeza que deseja deletar o amigo "${nome}"?`)) {
        return;
    }

    try {
        // Versão para API real (descomente quando tiver o backend funcionando)
        /*
        const resultado = await fazerRequisicao(`${API_BASE}/deletar/${id}`, {
            method: 'DELETE'
        });
        
        mostrarAlerta(resultado.mensagem);
        carregarAmigos();
        */

        // Versão simulada (remova quando usar a API real)
        amigos = amigos.filter(amigo => amigo.id !== id);
        
        mostrarAlerta(`Amigo "${nome}" deletado com sucesso!`);
        carregarAmigos();

    } catch (error) {
        mostrarAlerta('Erro ao deletar amigo: ' + error.message, 'error');
    }
}

// Função para fechar modal
function fecharModal() {
    document.getElementById('modalEdicao').style.display = 'none';
    amigoEditandoId = null;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar alguns amigos de exemplo (remova quando usar a API real)
    amigos = [
        { id: 1, nome: 'Ana Silva' },
        { id: 2, nome: 'Carlos Santos' },
        { id: 3, nome: 'Maria Oliveira' }
    ];
    proximoId = 4;
    
    // Carregar amigos iniciais
    carregarAmigos();

    // Event listener para Enter no campo de nome
    document.getElementById('nomeAmigo').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adicionarAmigo();
        }
    });

    // Event listener para Enter no campo de edição
    document.getElementById('nomeEdicao').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            salvarEdicao();
        }
    });

    // Fechar modal clicando fora dele
    window.onclick = function(event) {
        const modal = document.getElementById('modalEdicao');
        if (event.target === modal) {
            fecharModal();
        }
    }
});