const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
const productsController = require('../controllers/productsController');
const jwt = require("jsonwebtoken");

// Users 

router.get("/", userController.index);

router.get("/products", productsController.products);

router.get("/login", userController.login);

router.post("/login", userController.auth);

router.get("/signUp", userController.signUp);

router.post("/signUp", userController.storeUser);

router.get("/logOut", userController.logOut);

router.get("/cart", (req, res) => {
  res.render("cart");
});

router.get("/success", (req, res) => {
  res.render("success");
});

router.get("/settings", userController.settings);

router.post("/purchased", productsController.purchased)

router.post("/updateAccount", userController.updateAccount)

router.get("/shipment", (req, res) => {
  res.redirect("/")
})

router.post("/shipment", productsController.shipment)

router.post("/details", productsController.details)

// Admin products
router.get("/adminPanel", userController.adminPanel);

router.post("/userRole", userController.modifyUserRole)

router.get("/adminProducts", productsController.list);

router.post('/add', productsController.save);
router.get('/delete/:id', productsController.delete);
router.get('/update/:id', productsController.edit);
router.post('/update/:id', productsController.update);

module.exports = router;
