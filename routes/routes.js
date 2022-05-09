const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  });

router.get("/products.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/products.html"));
});

router.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

router.get("/signUp.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/signUp.html"));
});

router.get("/cart.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/cart.html"));
});

router.get("/success.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/success.html"));
});

router.get("/settings.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/settings.html"));
});


module.exports = router;
