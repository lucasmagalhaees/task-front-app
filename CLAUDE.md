# task-manager-frontend

Frontend Next.js para o Task Manager — consome uma API REST de gerenciamento de tarefas com suporte a plano de ação via IA.

## Stack

- **Next.js 14+** com App Router
- **TypeScript**
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes de UI
- **fetch** nativo para chamadas HTTP (sem biblioteca extra)

## Variáveis de Ambiente

Crie um `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Em Docker (backend rodando via `docker compose`), use `http://localhost:8001`.

Nunca use a URL da API hardcoded no código — sempre leia de `process.env.NEXT_PUBLIC_API_URL`.

## Estrutura de Pastas

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Página principal — lista de tasks
│   └── tasks/
│       └── [id]/
│           └── page.tsx    # Detalhe da task + consulting
├── components/
│   ├── TaskList.tsx        # Lista de tasks
│   ├── TaskCard.tsx        # Card individual de task
│   ├── TaskForm.tsx        # Formulário criar/editar task
│   └── ConsultingPanel.tsx # Painel do plano de ação IA
├── lib/
│   └── api.ts              # Todas as chamadas à API centralizadas aqui
└── types/
    └── task.ts             # Interfaces TypeScript
```

## Tipos TypeScript

```ts
// src/types/task.ts

export interface Task {
  id: number
  title: string
  description: string | null
  done: boolean
}

export interface TaskCreate {
  title: string           // obrigatório, mínimo 1 caractere
  description?: string | null
  done?: boolean          // default: false
}

export interface ConsultingResponse {
  task_id: number
  title: string
  action_plan: string     // plano de ação gerado por IA, texto livre com numeração
}
```

## Camada de API (`src/lib/api.ts`)

Toda comunicação com o backend deve passar por este arquivo. Nunca faça `fetch` diretamente nos componentes.

```ts
const BASE = process.env.NEXT_PUBLIC_API_URL

export async function getTasks(): Promise<Task[]>
export async function getTask(id: number): Promise<Task>
export async function createTask(data: TaskCreate): Promise<Task>
export async function updateTask(id: number, data: TaskCreate): Promise<Task>
export async function toggleTask(id: number): Promise<Task>
export async function deleteTask(id: number): Promise<void>
export async function getConsulting(id: number): Promise<ConsultingResponse>
```

Erros da API retornam `{ detail: string }` com o status HTTP correspondente. Trate erros lançando um `Error` com a mensagem de `detail`.

## Endpoints da API

### `GET /tasks`
Lista todas as tasks.

**Response 200:**
```json
[
  { "id": 1, "title": "Buy groceries", "description": null, "done": false }
]
```

---

### `POST /tasks`
Cria uma nova task.

**Request body:**
```json
{ "title": "Buy groceries", "description": "Milk, eggs", "done": false }
```

- `title` é obrigatório e deve ter pelo menos 1 caractere
- `description` é opcional
- `done` é opcional, default `false`

**Response 200:** objeto `Task`

---

### `GET /tasks/{id}`
Busca uma task por ID. Resultado é cacheado no backend (Redis ou memória).

**Response 200:** objeto `Task`
**Response 404:** `{ "detail": "Task not found" }`

---

### `PUT /tasks/{id}`
Atualiza todos os campos de uma task.

**Request body:** mesmo formato de `POST /tasks`

**Response 200:** objeto `Task` atualizado
**Response 404:** `{ "detail": "Task not found" }`

---

### `PUT /tasks/{id}/toggle`
Alterna o campo `done` da task (false → true → false).

**Response 200:** objeto `Task` com `done` invertido
**Response 404:** `{ "detail": "Task not found" }`

---

### `DELETE /tasks/{id}`
Remove uma task.

**Response 200:** `{ "message": "Task deleted" }`
**Response 404:** `{ "detail": "Task not found" }`

---

### `GET /tasks/{id}/consulting`
Gera um plano de ação para a task usando IA (GPT-4o-mini). A resposta é cacheada no backend — chamadas repetidas para o mesmo ID retornam instantaneamente sem custo adicional.

**Response 200:**
```json
{
  "task_id": 1,
  "title": "Buy groceries",
  "action_plan": "1. Make a shopping list\n2. Check pantry for missing items\n3. Go to the store"
}
```

**Response 404:** `{ "detail": "Task not found" }`

O campo `action_plan` é um texto com os passos numerados separados por `\n`. Renderize como lista ou com `whitespace-pre-line`.

---

## Comportamento esperado da UI

### Página principal (`/`)
- Exibe a lista completa de tasks
- Cada task mostra: título, descrição (se houver), badge done/pending
- Ações disponíveis por task: toggle done, editar, deletar
- Botão para criar nova task (abre modal ou formulário inline)
- Tasks concluídas devem ter visual diferenciado (ex: título riscado, opacidade reduzida)

### Página de detalhe (`/tasks/[id]`)
- Exibe todos os campos da task
- Botão **"Gerar plano de ação"** que chama `GET /tasks/{id}/consulting`
- Enquanto carrega, exibe skeleton ou spinner
- Exibe o `action_plan` como lista numerada após o retorno
- Se a task não tiver descrição, o botão pode ser exibido mesmo assim — o backend usa o título como contexto

### Formulário de task
- Campos: `title` (obrigatório), `description` (textarea, opcional), `done` (checkbox)
- Validação client-side: `title` não pode ser vazio
- Submissão chama `POST /tasks` (criar) ou `PUT /tasks/{id}` (editar)

## Convenções

- Componentes em PascalCase, arquivos em camelCase ou kebab-case
- Sem lógica de negócio nos componentes — toda chamada HTTP fica em `src/lib/api.ts`
- Sem `any` no TypeScript — use os tipos de `src/types/task.ts`
- Estados de loading e erro tratados em todos os fluxos que fazem fetch
- Respostas de erro da API exibidas ao usuário (toast ou mensagem inline)
- `.env.local` não deve ser commitado (adicionar ao `.gitignore`)
