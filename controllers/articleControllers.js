const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports.articleControllers = {
  all: async (req, res, next) => {
    try {
      const articles = await prisma.article.findMany({
        include: { comments: true },
      });
      res.json({ articles });
    } catch (error) {
      next(error);
    }
  },
  latest: async (req, res, next) => {
    try {
      const articles = await prisma.article.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: { comments: true },
      });
      res.json({ articles });
    } catch (error) {
      next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await prisma.article.findUnique({
        where: { id },
        include: { comments: true, user: true },
      });
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    console.log(req.body);
    try {
      const { title, content, isPublished, userId } = req.body;
      const article = await prisma.article.create({
        data: {
          title,
          content,
          isPublished,
          userId,
        },
      });
      res.json({
        message: `Article Created: ${article}`,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content, isPublished } = req.body;

      const article = await prisma.article.update({
        where: { id },
        data: {
          title,
          content,
          isPublished,
        },
      });
      res.json({
        message: `Article Updated: ${article}`,
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await prisma.article.delete({
        where: { id },
      });
      res.json({
        message: `Article Deleted: ${article}`,
      });
    } catch (error) {
      next(error);
    }
  },
  search: async (req, res, next) => {
    try {
      const { searchWord } = req.query;
      const articles = await prisma.article.findMany({
        where: {
          title: { contains: searchWord, mode: "insensitive" },
        },
        include: { comments: true }, // Should return an array, not null
      });
      res.json({
        articles,
      });
    } catch (error) {
      next(error);
    }
  },
};
