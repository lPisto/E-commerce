const express = require("express");
const router = express.Router();
const loginController = require('../controllers/loginController')
const productsController = require('../controllers/productsController');
const jwt = require("jsonwebtoken");

// Users 

router.get("/", loginController.index);

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

router.get("/settings", loginController.settings);

router.post("/purchased", productsController.purchased)

router.post("/updateAccount", loginController.updateAccount)

// Admin routes
router.post("/success", loginController.verifyToken, loginController.adminRoute);

// Admin products
router.get("/adminProducts", productsController.list);

router.post('/add', productsController.save);
router.get('/delete/:id', productsController.delete);
router.get('/update/:id', productsController.edit);
router.post('/update/:id', productsController.update);

module.exports = router;
