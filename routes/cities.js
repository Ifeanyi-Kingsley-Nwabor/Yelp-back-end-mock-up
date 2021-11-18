const express = require("express");
const db = require("../database/db");
//const upload = require("../utils/imageUploader");
const path = require("path");
const cityRouter = express.Router();

/* GET home page. */
cityRouter.get("/", (req, res, next) => {
  db.query("SELECT * FROM city ORDER BY id ASC")
    .then((data) => res.json(data.rows))
    .catch(next);
});

cityRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const getCity = {
    text: `SELECT * FROM city WHERE id = $1`,
    values: [id],
  };
  db.query(getCity)
    .then((data) => res.status(200).json(data.rows))
    .catch((err) => res.sendStatus(500));
});

cityRouter.post("/", (req, res, next) => {
  const { name } = req.body;
  const newCity = {
    text: `
      INSERT INTO city (name)
      VALUES($1)
      RETURNING *`,
    values: [name],
  };
  db.query(newCity)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
});
module.exports = cityRouter;
