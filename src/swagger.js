const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API - Express & Prisma',
      version: '1.0.0',
      description: 'Documentação interativa da API de Usuários e Posts utilizando Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Maria' },
            email: { type: 'string', example: 'maria@email.com' },
            posts: {
              type: 'array',
              items: { $ref: '#/components/schemas/Post' },
            },
          },
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', example: 'Maria' },
            email: { type: 'string', example: 'maria@email.com' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Meu primeiro post' },
            content: { type: 'string', example: 'Olá mundo!' },
            published: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time', example: '2026-10-02T12:00:00.000Z' },
            authorId: { type: 'integer', example: 1 },
          },
        },
        PostInput: {
          type: 'object',
          required: ['title', 'authorId'],
          properties: {
            title: { type: 'string', example: 'Meu primeiro post' },
            content: { type: 'string', example: 'Conteúdo opcional do post' },
            authorId: { type: 'integer', example: 1 },
          },
        },
        PostUpdateInput: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Título Atualizado' },
            content: { type: 'string', example: 'Conteúdo Atualizado' },
            published: { type: 'boolean', example: true },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📄 Swagger Docs disponível em http://localhost:3000/api-docs');
}

module.exports = setupSwagger;
