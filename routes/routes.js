const { articleControllers } = require("../controllers/articleControllers");
const { commentControllers } = require("../controllers/commentControllers");
const { userControllers } = require("../controllers/userControllers");
const {
  commentValidation,
  registerValidation,
} = require("../middlewares/validation");
const { verify } = require("../middlewares/verify");
const router = require("express").Router();

router.get("/", (req, res, next) => res.json({ message: "Blog API!" }));

// User Routes
router.get("/users", userControllers.all);
router.post("/users", registerValidation, userControllers.create);
router.post("/users/login", userControllers.login);
router.post("/users/refresh", userControllers.refresh);
router.post("/users/logout", verify, userControllers.logout);

// Article Routes
router.get("/articles/all", articleControllers.all);
router.get("/articles/latest", articleControllers.latest);
router.get("/articles/search", articleControllers.search);
router.get("/articles/author/:id/search", articleControllers.search);
router.get("/articles/author/:id", articleControllers.getByAuthorId);
router.post("/articles", verify, articleControllers.create); // C
router.get("/articles/:id", articleControllers.getById); // R
router.put("/articles/:id", verify, articleControllers.update); // U
router.delete("/articles/:id", verify, articleControllers.delete); // D

// Comment Routes
router.get("/articles/:id/comments", commentControllers.getByArticleId);
router.post(
  "/articles/:id/comments",
  commentValidation,
  commentControllers.create,
); // C
router.get("/articles/:id/:commentId", commentControllers.getById); // R
router.delete("/articles/:id/:commentId", commentControllers.delete); // D

module.exports = router;
