# Hub_XP_Backend

## Visão Geral

Este projeto consiste em uma aplicação full-stack com um backend NestJS e frontend React TypeScript, conteinerizada com Docker para facilitar a implantação e o desenvolvimento.

## Backend (Aplicação NestJS)

```
backend_hub_xp/
├── .env                  # Variáveis de ambiente (ignoradas pelo git)
├── envExample.txt        # Exemplo de variáveis de ambiente
├── Dockerfile            # Configuração do Docker
├── nest-cli.json         # Configuração da CLI do NestJS
├── package.json          # Dependências e scripts
├── src/                  # Código-fonte da aplicação
│   ├── app.controller.ts # Controlador principal
│   └── ...               # Outros arquivos de origem
├── test/                 # Arquivos de teste
├── uploads/              # Armazenamento de uploads de arquivos
├── data/                 # Persistência de dados
│   └── mongo/            # Arquivos de dados do MongoDB
└── volume/               # Mapeamento de volume do Docker
```

### Estrutura de Diretórios

### Configuração e Instalação

```bash
# Instalar dependências
cd backend_hub_xp
npm install

# Criar arquivo de variáveis de ambiente
cp envExample.txt .env
# Editar .env com sua configuração
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento com recarga automática
npm run start:dev

# Executar em modo de depuração
npm run start:debug
```

### Testes

```bash
# Testes unitários
npm run test

# Testes de ponta a ponta
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

### Build de Produção

```bash
# Construir para produção
npm run build

# Executar servidor de produção
npm run start:prod
```

### Principais Recursos

- **API REST**: Construída com controladores e serviços NestJS
- **Integração com MongoDB**: Persistência de dados com MongoDB
- **Uploads de Arquivos**: Suporte para uploads de arquivos para armazenamento local ou S3
- **Autenticação**: Sistema de autenticação baseado em JWT
- **Validação**: Validação de requisições usando class-validator
- **Swagger**: Documentação da API com OpenAPI

## Frontend (Aplicação React TypeScript)

### Estrutura de Diretórios

```
frontend_hub_xp/
├── .env                  # Variáveis de ambiente
├── Dockerfile            # Configuração do Docker
├── nginx.conf            # Configuração do Nginx para produção
├── package.json          # Dependências e scripts
├── vite.config.ts        # Configuração do Vite
├── tsconfig.json         # Configuração do TypeScript
├── .storybook/           # Configuração do Storybook
├── public/               # Ativos estáticos
└── src/                  # Código-fonte da aplicação
```

### Configuração e Instalação

```bash
# Instalar dependências
cd frontend_hub_xp
npm install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar Storybook para desenvolvimento de componentes
npm run storybook
```

### Build de Produção

```bash
# Construir para produção
npm run build

# Visualizar build de produção
npm run preview
```

### Principais Recursos

- **React**: UI moderna baseada em componentes
- **TypeScript**: Desenvolvimento com segurança de tipos
- **Vite**: Desenvolvimento rápido e builds otimizados
- **Storybook**: Documentação e desenvolvimento de componentes
- **ESLint & Prettier**: Qualidade de código e formatação
- **React Router**: Roteamento do lado do cliente
- **Material UI/Styled Components**: Framework de UI (assumido com base em configurações típicas)

## Configuração do Docker

O projeto é conteinerizado para desenvolvimento consistente e fácil implantação.

### Configuração

O `docker-compose.yml` na raiz configura os seguintes serviços:

**Backend**: Aplicação NestJS

- Conectado ao MongoDB
- Expõe API na porta 3000
- Variáveis de ambiente do arquivo .env

**Frontend**: Aplicação React

- Servido via Nginx
- Expõe UI na porta 80/443
- Conectado à API de backend

**MongoDB**: Serviço de banco de dados

- Dados persistidos em ./backend_hub_xp/data/mongo

**Serviços adicionais** (potencialmente):

- LocalStack para emulação de serviços AWS
- Redis para cache

### Uso

```bash
# Iniciar todos os serviços
docker-compose up

# Iniciar em modo destacado
docker-compose up -d

# Iniciar serviço específico
docker-compose up backend

# Reconstruir contêineres
docker-compose up --build

# Parar todos os serviços
docker-compose down

# Visualizar logs
docker-compose logs -f
```

## Fluxo de Trabalho de Desenvolvimento

1. Iniciar o ambiente de desenvolvimento:

```bash
docker-compose up
```

2. Desenvolvimento do backend:

   - Editar arquivos em src
   - API disponível em http://localhost:3000

3. Desenvolvimento do frontend:

   - Editar arquivos em src
   - UI disponível em http://localhost:5173 (desenvolvimento)
   - Storybook disponível em http://localhost:6006

4. Acesso ao banco de dados:
   - MongoDB disponível em mongodb://localhost:27017

## Implantação

Para implantação em produção:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
```

1. Construir imagens de produção:
2. Implantar em seu ambiente de hospedagem:
   - Usar Docker Swarm ou Kubernetes para orquestração
   - Configurar variáveis de ambiente apropriadas
   - Configurar HTTPS com certificados

## Recursos Adicionais

- [Documentação NestJS](https://docs.nestjs.com/)
- [Documentação React](https://reactjs.org/docs/getting-started.html)
- [Documentação Docker](https://docs.docker.com/)
- [Documentação Storybook](https://storybook.js.org/docs/react/get-started/introduction)
