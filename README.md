# API de Feedback e Progresso de Jogadores

API REST desenvolvida com **Node.js**, **Express** e **SQLite** para registrar feedbacks e salvar o progresso de jogadores.

---

## Tecnologias

| Tecnologia | Versão recomendada |
|------------|--------------------|
| Node.js    | v18+               |
| Express    | latest             |
| SQLite3    | latest             |

---

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd <nome-do-projeto>

# Instale as dependências
npm install

# Inicie o servidor
node servidor.js
```

> O servidor sobe na porta **3000** por padrão. Para usar outra porta:
> ```bash
> PORT=8080 node servidor.js
> ```

---

## Estrutura de Arquivos

```
├── servidor.js          # Ponto de entrada, configura o Express e as rotas
├── database.js          # Conexão SQLite e criação das tabelas
├── rotas/
│   ├── feedback.js      # POST /api/feedback
│   └── progresso.js     # POST e GET /api/progresso
└── database.sqlite      # Banco de dados (gerado automaticamente)
```

---

## Endpoints

### `GET /`
Retorna informações sobre o servidor e as rotas disponíveis.

---

### `POST /api/feedback`
Registra o feedback de um jogador.

**Body (JSON):**
```json
{
  "playerName": "Joao",
  "mensagem": "Jogo muito divertido!",
  "avaliacao": 5
}
```
| Campo        | Tipo    | Obrigatório | Descrição            |
|--------------|---------|-------------|----------------------|
| `playerName` | string  |   ✅ Sim   | Nome do jogador       |
| `mensagem`   | string  |   ✅ Sim   | Texto do feedback     |
| `avaliacao`  | integer |   ❌ Não   | Nota numérica inteira |

**Resposta de sucesso — `201 Created`:**
```json
{
  "id": 1,
  "playerName": "Joao",
  "mensagem": "Jogo muito divertido!",
  "avaliacao": 5
}
```

---

### `POST /api/progresso`
Salva ou atualiza o progresso de um jogador. Se o `playerId` já existir, o registro é atualizado (UPSERT).

**Body (JSON):**
```json
{
  "playerId": "player-001",
  "playerName": "Maria",
  "nivel": 3,
  "pontos": 1500,
  "data": { "fase": "floresta", "vidas": 3 }
}
```

| Campo        | Tipo    | Obrigatório | Padrão |         Descrição         |
|--------------|---------|-------------|--------|---------------------------|
| `playerId`   | string  |   ✅ Sim   | —      | ID único do jogador        |
| `playerName` | string  |   ❌ Não   | `null` | Nome do jogador            |
| `nivel`      | integer |   ❌ Não   | `1`    | Nível atual                | 
| `pontos`     | integer |   ❌ Não   | `0`    | Pontuação atual            |
| `data`       | object  |   ❌ Não   | `null` | Dados extras em JSON livre |

**Resposta de sucesso — `200 OK`:**
```json
{
  "playerId": "player-001",
  "playerName": "Maria",
  "nivel": 3,
  "pontos": 1500,
  "data": { "fase": "floresta", "vidas": 3 }
}
```

---

### `GET /api/progress/:playerId`
Busca o progresso de um jogador pelo ID.

**Exemplo:**
```
GET /api/progress/player-001
```

**Resposta de sucesso — `200 OK`:**
```json
{
  "id": 1,
  "playerId": "player-001",
  "playerName": "Maria",
  "nivel": 3,
  "pontos": 1500,
  "data": { "fase": "floresta", "vidas": 3 },
  "updatedAt": "2024-01-15 10:30:00"
}
```

**Erros possíveis:**
- `404 Not Found` — jogador não encontrado
- `500 Internal Server Error` — erro no banco de dados

---

## Banco de Dados

O arquivo `database.sqlite` é criado automaticamente na primeira execução.

### Tabela `feedback`
| Coluna        |    Tipo    |      Descrição       | 
|---------------|------------|----------------------|
| `id`          | INTEGER PK | Identificador único  |
| `player_name` | TEXT       | Nome do jogador      |
| `mensagem`    | TEXT       | Texto do feedback    |
| `avaliacao`   | INTEGER    | Nota (pode ser nula) |
| `created_at`  | TEXT       | Data de criação      |

### Tabela `player_progress`
|     Coluna    |     Tipo    |        Descrição        |
|---------------|-------------|-------------------------|
| `id`          | INTEGER PK  | Identificador interno   |
| `player_id`   | TEXT UNIQUE | ID externo do jogador   |
| `player_name` | TEXT        | Nome do jogador         |
| `nivel`       | INTEGER     | Nível atual (default 1) |
| `pontos`      | INTEGER     | Pontuação (default 0)   |
| `data`        | TEXT        | JSON serializado        |
| `updated_at`  | TEXT        | Última atualização      |

---

## Respostas de Erro

| Status |                     Situação                    |
|--------|-------------------------------------------------|
| `400`  | Campos obrigatórios ausentes ou tipos inválidos |
| `404`  | Jogador não encontrado                          |
| `500`  | Erro interno no banco de dados                  |

---

## Observações

- O projeto usa **ES Modules** — certifique-se de ter `"type": "module"` no `package.json`.
- O campo `data` em `player_progress` aceita qualquer objeto JSON, permitindo extensibilidade sem alterar o schema.
- A estratégia **UPSERT** (`ON CONFLICT DO UPDATE`) garante que cada `playerId` tenha somente um registro.
