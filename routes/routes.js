const express = require("express");
const router = express.Router();
const loginController = require('../controllers/loginController')

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/index", (req, res) => {
  res.render("index");
});

router.get("/products", (req, res) => {
  res.render("products");
});

router.get("/login", loginController.login);

router.post("/login", loginController.auth);

router.get("/signUp", loginController.signUp);

router.post("/signUp", loginController.storeUser);

router.get("/logOut", loginController.logOut);

router.get("/cart", (req, res) => {
  res.render("cart");
});

router.get("/success", (req, res) => {
  res.render("success");
});

router.get("/settings", (req, res) => {
  res.render("settings");
});

module.exports = router;
