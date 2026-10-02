const express = require('express');
const prisma = require('../prisma');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Nome e e-mail são obrigatórios
 *       409:
 *         description: E-mail já cadastrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name e email são obrigatórios' });
    }
    const user = await prisma.user.create({ data: { name, email } });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os usuários (com seus posts)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { posts: true } });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar um usuário por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { posts: true },
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar um usuário por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { name, email },
    });
    res.json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletar um usuário por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
