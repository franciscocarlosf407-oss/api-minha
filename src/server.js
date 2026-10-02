const express = require('express');
const prisma = require('./prisma');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const setupSwagger = require('./swagger');

const app = express();

app.use(express.json());

// Documentação do Swagger UI
setupSwagger(app);

app.get('/', (req, res) => res.json({ message: 'API funcionando 🚀', docs: 'http://localhost:3000/api-docs' }));
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação Swagger em http://localhost:${PORT}/api-docs`);
});

// Fecha a conexão com o banco ao encerrar
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
