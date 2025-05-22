from flask import Flask, request, jsonify, render_template  # Removido o CORS
import sqlite3

app = Flask(__name__)

# Cria o banco e as tabelas se não existirem
def criar_banco():
    conn = sqlite3.connect('amigos.db')
    cursor = conn.cursor()
    
    # Tabela de amigos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS amigos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabela de categorias/grupos de amigos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            descricao TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabela de relacionamento amigos-categorias (muitos para muitos)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS amigo_categoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amigo_id INTEGER,
            categoria_id INTEGER,
            FOREIGN KEY (amigo_id) REFERENCES amigos (id) ON DELETE CASCADE,
            FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    conn.close()

criar_banco()

# Página principal
@app.route('/')
def home():
    return render_template('index.html')

# CREATE - API para cadastrar amigo
@app.route('/api/adicionar', methods=['POST'])
def adicionar():
    try:
        dados = request.json
        
        # Validação básica
        if not dados or 'nome' not in dados:
            return jsonify({'erro': 'Nome é obrigatório'}), 400
            
        nome = dados['nome'].strip()
        
        if not nome:
            return jsonify({'erro': 'Nome não pode estar vazio'}), 400

        conn = sqlite3.connect('amigos.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO amigos (nome) VALUES (?)', (nome,))
        amigo_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return jsonify({
            'mensagem': 'Amigo adicionado com sucesso!',
            'id': amigo_id,
            'nome': nome
        }), 201
        
    except Exception as e:
        return jsonify({'erro': f'Erro interno do servidor: {str(e)}'}), 500

# READ - API para listar todos os amigos
@app.route('/api/listar')
def listar():
    try:
        conn = sqlite3.connect('amigos.db')
        cursor = conn.cursor()
        cursor.execute('SELECT id, nome, created_at FROM amigos ORDER BY nome')
        amigos = [
            {
                'id': linha[0], 
                'nome': linha[1],
                'created_at': linha[2]
            } for linha in cursor.fetchall()
        ]
        conn.close()
        
        return jsonify(amigos)
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao buscar amigos: {str(e)}'}), 500

# READ - API para buscar amigo por ID
@app.route('/api/amigo/<int:amigo_id>')
def buscar_amigo(amigo_id):
    try:
        conn = sqlite3.connect('amigos.db')
        cursor = conn.cursor()
        cursor.execute('SELECT id, nome, created_at FROM amigos WHERE id = ?', (amigo_id,))
        resultado = cursor.fetchone()
        conn.close()
        
        if resultado:
            amigo = {
                'id': resultado[0], 
                'nome': resultado[1],
                'created_at': resultado[2]
            }
            return jsonify(amigo)
        else:
            return jsonify({'erro': 'Amigo não encontrado'}), 404
            
    except Exception as e:
        return jsonify({'erro': f'Erro ao buscar amigo: {str(e)}'}), 500

# UPDATE - API para atualizar amigo
@app.route('/api/atualizar/<int:amigo_id>', methods=['PUT'])
def atualizar(amigo_id):
    try:
        dados = request.json
        
        # Validação básica
        if not dados or 'nome' not in dados:
            return jsonify({'erro': 'Nome é obrigatório'}), 400
            
        novo_nome = dados['nome'].strip()
        
        if not novo_nome:
            return jsonify({'erro': 'Nome não pode estar vazio'}), 400

        conn = sqlite3.connect('amigos.db')
        cursor = conn.cursor()
        
        # Verifica se o amigo existe
        cursor.execute('SELECT nome FROM amigos WHERE id = ?', (amigo_id,))
        resultado = cursor.fetchone()
        
        if not resultado:
            conn.close()
            return jsonify({'erro': 'Amigo não encontrado'}), 404
        
        nome_anterior = resultado[0]
        
        # Atualiza o nome
        cursor.execute('UPDATE amigos SET nome = ? WHERE id = ?', (novo_nome, amigo_id))
        conn.commit()
        conn.close()

        return jsonify({
            'mensagem': f'Amigo "{nome_anterior}" atualizado para "{novo_nome}" com sucesso!',
            'id': amigo_id,
            'nome_anterior': nome_anterior,
            'nome_novo': novo_nome
        })
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao atualizar amigo: {str(e)}'}), 500

# DELETE - API para deletar amigo
@app.route('/api/deletar/<int:amigo_id>', methods=['DELETE'])
def deletar(amigo_id):
    try:
        conn = sqlite3.connect('amigos.db')
        cursor = conn.cursor()
        
        # Verifica se o amigo existe antes de deletar
        cursor.execute('SELECT nome FROM amigos WHERE id = ?', (amigo_id,))
        resultado = cursor.fetchone()
        
        if not resultado:
            conn.close()
            return jsonify({'erro': 'Amigo não encontrado'}), 404
        
        nome_deletado = resultado[0]
        
        # Deleta o amigo
        cursor.execute('DELETE FROM amigos WHERE id = ?', (amigo_id,))
        conn.commit()
        conn.close()

        return jsonify({
            'mensagem': f'Amigo "{nome_deletado}" deletado com sucesso!',
            'id': amigo_id,
            'nome': nome_deletado
        })
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao deletar amigo: {str(e)}'}), 500

# API para buscar amigos por nome (filtro)
@app.route('/api/buscar')
def buscar_por_nome():
    try:
        termo = request.args.get('nome', '').strip()
        
        conn = sqlite3.connect('amigos.db')
        cursor = conn.cursor()
        
        if termo:
            cursor.execute(
                'SELECT id, nome, created_at FROM amigos WHERE nome LIKE ? ORDER BY nome', 
                (f'%{termo}%',)
            )
        else:
            cursor.execute('SELECT id, nome, created_at FROM amigos ORDER BY nome')
            
        amigos = [
            {
                'id': linha[0], 
                'nome': linha[1],
                'created_at': linha[2]
            } for linha in cursor.fetchall()
        ]
        conn.close()
        
        return jsonify(amigos)
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao buscar amigos por nome: {str(e)}'}), 500

# Tratamento de erro para métodos não permitidos
@app.errorhandler(405)
def metodo_nao_permitido(e):
    return jsonify({'erro': 'Método não permitido'}), 405

# Tratamento de erro para JSON inválido
@app.errorhandler(400)
def requisicao_invalida(e):
    return jsonify({'erro': 'Dados inválidos'}), 400

# Tratamento de erro para recursos não encontrados
@app.errorhandler(404)
def nao_encontrado(e):
    return jsonify({'erro': 'Recurso não encontrado'}), 404

# Tratamento de erro interno do servidor
@app.errorhandler(500)
def erro_interno(e):
    return jsonify({'erro': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)