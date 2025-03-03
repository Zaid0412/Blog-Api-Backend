const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

module.exports.commentControllers = {
  getByArticleId: async (req, res, next) => {
    try {
      const { id } = req.params;
      const comments = await prisma.comment.findMany({
        where: { articleId: id },
      });
      res.json({ comments });
    } catch (error) {
      next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      const { commentId } = req.params;
      console.log(commentId);
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });
      res.json({
        comment,
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // res.render("register", {
        //   user: req.user || null,
        //   errors: errors.array(),
        // });
        return res.json({
          errors,
        });
      } else {
        const { id } = req.params;
        const { content, username } = req.body;
        const comment = await prisma.comment.create({
          data: {
            content,
            username,
            articleId: id,
          },
        });
        res.json({
          message: `Comment Created: ${comment}`,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const comment = await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
      res.json({
        message: `Comment Deleted: ${comment}`,
      });
    } catch (error) {
      next(error);
    }
  },
};
