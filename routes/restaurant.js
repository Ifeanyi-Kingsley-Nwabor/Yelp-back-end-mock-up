const express = require("express");
const db = require("../database/db");
//const upload = require("../utils/imageUploader");
const path = require("path");
const restautantRouter = express.Router();

/* GET home page. */
restautantRouter.get("/", (req, res, next) => {
  db.query("SELECT * FROM restaurant ORDER BY id ASC")
    .then((data) => res.json(data.rows))
    .catch(next);
});

restautantRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const getRestaurant = {
    text: `SELECT * FROM restaurant WHERE id = $1`,
    values: [id],
  };
  db.query(getRestaurant)
    .then((data) => res.status(200).json(data.rows))
    .catch((err) => res.sendStatus(500));
});

restautantRouter.post("/", (req, res, next) => {
  const { name, featured_image, city_id, description, restaurant_url } =
    req.body;
  const newRestaurant = {
    text: `
      INSERT INTO restaurant (name, featured_image, city_id, description, restaurant_url)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
    values: [name, featured_image, city_id, description, restaurant_url],
  };
  db.query(newRestaurant)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
});
module.exports = restautantRouter;
