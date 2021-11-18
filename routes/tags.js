const express = require("express");
const db = require("../database/db");
//const upload = require("../utils/imageUploader");
const path = require("path");
const tagRouter = express.Router();

/* GET home page. */
tagRouter.get("/", (req, res, next) => {
  db.query("SELECT * FROM tag ORDER BY id ASC")
    .then((data) => res.json(data.rows))
    .catch(next);
});

tagRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const getTag = {
    text: `SELECT * FROM tag WHERE id = $1`,
    values: [id],
  };
  db.query(getTag)
    .then((data) => res.status(200).json(data.rows))
    .catch((err) => res.sendStatus(500));
});

tagRouter.post("/", (req, res, next) => {
  const { name } = req.body;
  const newTag = {
    text: `
      INSERT INTO tag (name)
      VALUES($1)
      RETURNING *`,
    values: [name],
  };
  db.query(newTag)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
});
module.exports = tagRouter;
