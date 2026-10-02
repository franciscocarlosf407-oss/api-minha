const express = require('express');
const prisma = require('../prisma');

const router = express.Router();

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Criar um novo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Título ou authorId inválido / autor não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    if (!title || !authorId) {
      return res.status(400).json({ error: 'title e authorId são obrigatórios' });
    }
    const post = await prisma.post.create({
      data: { title, content, authorId: Number(authorId) },
    });
    res.status(201).json(post);
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Autor não existe' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Listar todos os posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filtrar posts por status de publicação (true ou false)
 *     responses:
 *       200:
 *         description: Lista de posts obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.published !== undefined) {
      where.published = req.query.published === 'true';
    }
    const posts = await prisma.post.findMany({
      where,
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualizar ou publicar um post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostUpdateInput'
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, content, published } = req.body;
    const post = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: { title, content, published },
    });
    res.json(post);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Deletar um post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post
 *     responses:
 *       204:
 *         description: Post deletado com sucesso
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
