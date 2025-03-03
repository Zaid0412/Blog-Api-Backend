const { articleControllers } = require("../controllers/articleControllers");
const { commentControllers } = require("../controllers/commentControllers");
const { userControllers } = require("../controllers/userControllers");
const { commentValidation } = require("../middlewares/validation");
const router = require("express").Router();

router.get("/", (req, res, next) => res.json({ message: "Blog API!" }));

router.get("/users", userControllers.all);
router.post("/users", userControllers.create);

router.get("/articles/all", articleControllers.all);
router.get("/articles/latest", articleControllers.latest);
router.get("/articles/search", articleControllers.search);
router.post("/articles", articleControllers.create); // C
router.get("/articles/:id", articleControllers.getById); // R
router.put("/articles/:id", articleControllers.update); // U
router.delete("/articles/:id", articleControllers.delete); // D

router.get("/articles/:id/comments", commentControllers.getByArticleId);
router.post(
  "/articles/:id/comments",
  commentValidation,
  commentControllers.create,
); // C
router.get("/articles/:id/:commentId", commentControllers.getById); // R
router.delete("/articles/:id/:commentId", commentControllers.delete); // D

module.exports = router;
