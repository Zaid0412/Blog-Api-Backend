const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

module.exports.userControllers = {
  all: async (req, res, next) => {
    const users = await prisma.user.findMany();
    res.json({
      users,
    });
  },
  create: async (req, res, next) => {
    res.json({
      message: `Creating User!`,
    });
    try {
      const { username, email, password } = req.body; // Getting all vals from req.body
      const hashedPassword = await bcrypt.hash(password, 10); // Hashing password
      const user = await prisma.user.create({
        // Create user
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      res.json({
        message: `User Created: ${user}`,
      });
    } catch (error) {}
  },
};
