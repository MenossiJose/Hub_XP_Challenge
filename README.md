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
### População de Dados Em Massa
Para a aplicação funcionar corretamenta execute o script presente em:
``` bash
cd \Hub_XP_Challenge\backend_hub_xp\src\scripts\seed.ts
```
Com o comando:
``` bash
npx ts-node scripts/seed.ts
```

### Lambda
Conforme o requisito do desafio fora criado um uma função assíncrona através
do serverless e com o uso do aws Lambda, o handler específico criado 
processa relatórios de vendas (com base nos Orders).

Para poder usar a aplicação se direciona a:
``` bash
cd \Hub_XP_Challenge\backend_hub_xp\src\serverless\lambda
```
Após isso siga a documentação presente no site para configurar suas credencias aws e rodar a aplicação.
A mesma se conecta com mongoDB para criar relatórias de forma assíncrona.

###CRUD
Todas entidades criadas possuem CRUD e também validação de dados usado DTOs para cada rota.

## Endpoints Disponíveis

A API possui os seguintes endpoints principais:

### **1. Produtos (/products)**

| Método | Rota               | Descrição                          |
|---------|------------------|--------------------------------|
| POST    | `/products`      | Criar um novo produto        |
| GET     | `/products`      | Listar todos os produtos     |
| GET     | `/products/:id`  | Buscar um produto pelo ID    |
| PATCH   | `/products/:id`  | Atualizar um produto pelo ID |
| DELETE  | `/products/:id`  | Deletar um produto pelo ID   |

### **2. Categorias (/categories)**

| Método | Rota                  | Descrição                          |
|---------|---------------------|--------------------------------|
| POST    | `/categories`       | Criar uma nova categoria      |
| GET     | `/categories`       | Listar todas as categorias    |
| GET     | `/categories/:id`   | Buscar uma categoria pelo ID  |
| PATCH   | `/categories/:id`   | Atualizar uma categoria pelo ID |
| DELETE  | `/categories/:id`   | Deletar uma categoria pelo ID |

### **3. Upload de Imagens (/upload)**

| Método | Rota       | Descrição              |
|---------|-----------|----------------------|
| POST    | `/upload` | Fazer upload de uma imagem |

### **4. Pedidos (/orders)**

| Método | Rota              | Descrição                      |
|---------|-----------------|------------------------------|
| POST    | `/orders`       | Criar um novo pedido       |
| GET     | `/orders`       | Listar todos os pedidos    |
| GET     | `/orders/:id`   | Buscar um pedido pelo ID   |
| PATCH   | `/orders/:id`   | Atualizar um pedido pelo ID |
| DELETE  | `/orders/:id`   | Deletar um pedido pelo ID  |

### **5. Dashboard (/dashboard)**

| Método | Rota         | Descrição                         |
|---------|------------|---------------------------------|
| GET     | `/dashboard` | Acessar o dashboard de KPIs |

---

## **Instruções para Testes**

### **CRUD de Produtos**
1. **Criar um produto:**
   ```sh
   curl -X POST http://localhost:3000/products \
        -H "Content-Type: application/json" \
        -d '{"name": "Produto 1", "description": "Descrição do produto", "price": 99.90, "categoryIds": ["id_da_categoria"]}'
   ```

2. **Listar todos os produtos:**
   ```sh
   curl -X GET http://localhost:3000/products
   ```

3. **Buscar um produto pelo ID:**
   ```sh
   curl -X GET http://localhost:3000/products/{id}
   ```

4. **Atualizar um produto:**
   ```sh
   curl -X PATCH http://localhost:3000/products/{id} \
        -H "Content-Type: application/json" \
        -d '{"name": "Produto Atualizado"}'
   ```

5. **Deletar um produto:**
   ```sh
   curl -X DELETE http://localhost:3000/products/{id}
   ```

### **Upload de Imagem**
1. **Fazer upload de uma imagem:**
   ```sh
   curl -X POST http://localhost:3000/upload \
        -F "file=@/caminho/para/imagem.jpg"
   ```

### **Dashboard de KPIs**
1. **Acessar os KPIs do dashboard:**
   ```sh
   curl -X GET http://localhost:3000/dashboard
   ```

---

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

5. Acesso ao localstack:
   - Localstack disponível em http://localhost:4566

## Implantação

Para implantação em produção:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
```


## Recursos Adicionais

- [Documentação NestJS](https://docs.nestjs.com/)
- [Documentação React](https://reactjs.org/docs/getting-started.html)
- [Documentação Docker](https://docs.docker.com/)
- [Documentação Storybook](https://storybook.js.org/docs/react/get-started/introduction)
