const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/index", (req, res) => {
  res.render("index");
});

router.get("/products", (req, res) => {
  res.render("products");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  console.log(req.body);
});

router.get("/signUp", (req, res) => {
  res.render('signUp')
});

router.post("/signUp", (req, res) => {
  console.log(req.body);
});

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
