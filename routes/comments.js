const express = require("express");
const db = require("../database/db");
//const upload = require("../utils/imageUploader");
const path = require("path");
const commentRouter = express.Router();

/* GET home page. */
commentRouter.get("/", (req, res, next) => {
    db.query("SELECT * FROM comments ORDER BY id ASC")
    .then((data) => res.json(data.rows))
    .catch(next);
});
//db.query(`SELECT restaurant.id, restaurant.name, restaurant.featured_image, restaurant.city_id, restaurant.description, restaurant.restaurant_url, city.id,  city.name FROM restaurant JOIN city ON city.id=restaurant.city_id ORDER BY restaurant.id ASC`)
//db.query("SELECT * FROM comments ORDER BY id ASC")

//SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
//FROM Orders
//INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;

commentRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const getComment = {
    text: `SELECT * FROM comments WHERE id = $1`,
    values: [id],
  };
  db.query(getComment)
    .then((data) => res.status(200).json(data.rows))
    .catch((err) => res.sendStatus(500));
});

commentRouter.post("/", (req, res, next) => {
  const { text, date, restaurant_id } =
    req.body;
  const newComment = {
    text: `
      INSERT INTO comments (text, date, restaurant_id)
      VALUES($1,$2,$3)
      RETURNING *`,
    values: [text, date, restaurant_id],
  };
  db.query(newComment)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
});
module.exports = commentRouter;
