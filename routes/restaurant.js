const express = require("express");
const db = require("../database/db");
//const upload = require("../utils/imageUploader");
const path = require("path");
const restaurantRouter = express.Router();

/* GET home page. */
restaurantRouter.get("/", (req, res, next) => {
  db.query(
    `SELECT restaurant.id, restaurant.restaurant_name, restaurant.featured_image, restaurant.city_id, restaurant.description, restaurant.restaurant_url, city.id, city.name FROM restaurant JOIN city ON city.id=restaurant.city_id ORDER BY restaurant.id ASC`
  )
    .then((data) => res.json(data.rows))
    .catch(next);
});
//db.query(`SELECT restaurant.id, restaurant.name, restaurant.featured_image, restaurant.city_id, restaurant.description, restaurant.restaurant_url, city.id,  city.name FROM restaurant JOIN city ON city.id=restaurant.city_id ORDER BY restaurant.id ASC`)
//db.query("SELECT * FROM restaurant ORDER BY id ASC")

//SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
//FROM Orders
//INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;

restaurantRouter.get("/allData/:id", async (req, res) => {
  const { id } = req.params;

  const restaurantsAndCities = {
    text: `
    SELECT 
      r.id, 
      r.restaurant_name, 
      r.featured_image, 
      r.city_id, 
      r.description, 
      r.restaurant_url, 
      c.name AS city_name
    FROM restaurant r
    JOIN city c 
    ON c.id = r.city_id
    WHERE r.id = $1`,
    values: [id],
  };

  const commentsQuery = {
    text: `
    SELECT
      co.id AS comment_id, 
      co.text AS comment_text,
      co.date AS comment_date
    FROM comments co
    JOIN restaurant r
    ON co.restaurant_id = r.id
    WHERE r.id = $1
    `,
    values: [id],
  };

  try {
    const { rows: restaurantAndCityData } = await db.query(
      restaurantsAndCities
    );
    const { rows: commentsData } = await db.query(commentsQuery);

    const result = {
      ...restaurantAndCityData["0"],
      comments: commentsData,
    };

    res.json(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

restaurantRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const getRestaurant = {
    text: `SELECT * FROM restaurant WHERE id = $1`,
    values: [id],
  };
  db.query(getRestaurant)
    .then((data) => res.status(200).json(data.rows))
    .catch((err) => res.sendStatus(500));
});

restaurantRouter.post("/", (req, res, next) => {
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
module.exports = restaurantRouter;
