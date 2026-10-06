# Minha API - Express & Prisma
Francisco Carlos

API RESTful desenvolvida com Node.js, Express, Prisma ORM e SQLite, com documentação interativa utilizando Swagger UI.

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **Prisma ORM**
- **SQLite**
- **Swagger UI (`swagger-ui-express` & `swagger-jsdoc`)**
- **Nodemon**

---

## 🛠️ Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/franciscocarlosf407-oss/api-minha.git
cd api-minha
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar o arquivo `.env`
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
```env
DATABASE_URL="file:./dev.db"
```

### 4. Executar as migrações do banco de dados
```bash
npx prisma migrate dev --name init
```

### 5. Iniciar o servidor em modo de desenvolvimento
```bash
npm run dev
```

---

## 📄 Documentação Swagger UI

Após iniciar o servidor, a documentação interativa das rotas estará disponível em:
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---

## 📌 Rotas Principais

### Usuários (`/users`)
- `POST /users`: Criar um novo usuário
- `GET /users`: Listar todos os usuários com seus posts
- `GET /users/:id`: Buscar usuário por ID
- `PUT /users/:id`: Atualizar usuário por ID
- `DELETE /users/:id`: Deletar usuário por ID

### Posts (`/posts`)
- `POST /posts`: Criar um novo post
- `GET /posts`: Listar todos os posts (opcional: `?published=true`)
- `PUT /posts/:id`: Atualizar / publicar post por ID
- `DELETE /posts/:id`: Deletar post por ID
