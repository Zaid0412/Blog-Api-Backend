const router = require("./routes/routes");
const express = require("express");
const path = require("node:path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Parses JSON body requests

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(router);

app.listen(PORT, () => console.log(`App listening on Port: ${PORT}`));
