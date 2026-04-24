# Task Manager Frontend

# Desenvolvimento local
dev:
    npm run dev

# Build de produção local
build:
    npm run build

# Instalar dependências
install:
    npm install

# --- Docker ---

# Subir containers em background
up:
    docker compose up -d

# Subir com rebuild forçado
up-build:
    docker compose up -d --build

# Parar e remover containers
down:
    docker compose down

# Rebuild da imagem sem subir
build-image:
    docker compose build

# Rebuild forçado sem cache (útil quando variáveis de build mudam)
rebuild:
    docker compose build --no-cache

# Ver logs em tempo real
logs:
    docker compose logs -f frontend

# Reiniciar o container do frontend
restart:
    docker compose restart frontend

# Status dos containers
ps:
    docker compose ps
