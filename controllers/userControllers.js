const { validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

const generateAccessToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_REFRESH_KEY, { expiresIn: "7d" });
};

let refreshTokens = [];

module.exports.userControllers = {
  all: async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  create: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) {
        return res.status(400).json({ error: "Invalid username or password." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid username or password." });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);

      res.json({ user, accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  refresh: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(401).json({ error: "Authentication required." });
      }

      if (!refreshTokens.includes(token)) {
        return res.status(403).json({ error: "Invalid refresh token." });
      }

      jwt.verify(token, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) {
          console.error(err);
          return res.status(403).json({ error: "Token verification failed." });
        }

        refreshTokens = refreshTokens.filter((t) => t !== token);
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);

        res.json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  logout: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: "No token provided." });
      }

      refreshTokens = refreshTokens.filter((t) => t !== token);
      res.status(200).json({ message: "User logged out!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
