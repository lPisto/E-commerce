const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/index.html", (req, res) => {
  res.render("index");
});

router.get("/products.html", (req, res) => {
  res.render("products");
});

router.get("/login.html", (req, res) => {
  res.render("login");
});

router.get("/signUp", (req, res) => {
  res.render("signUp");
});

// router.post('/signUp.html', (req, res) => {
//   const {name, surname, email, password, confirm_password, contact} = req.body;
//   let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
  
//   if(!regexEmail.test(email.value)){
//     warning.innerHTML = `El email no es valido <br>`
//   }

//   if (password != confirm_password) {
//     alert('Password do not match');    
//   }
//   if (password.length < 4) {
//     errors.push({text: 'Password must be at least 4 characters'})
//   }
//   if (errors.length > 0) {
//     res.render('signUp.html', {errors, name, surname, email, password, confirm_password, contact});
//   } else {
//     res.send('ok')
//   }
// });

router.get("/cart.html", (req, res) => {
  res.render("cart");
});

router.get("/success.html", (req, res) => {
  res.render("success");
});

router.get("/settings.html", (req, res) => {
  res.render("settings");
});


module.exports = router;
