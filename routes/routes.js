const express = require("express");
const router = express.Router();
const { registerCtrl } = require('../controllers/registerCtrl')

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
  res.render('signUp', {
    wrongPass: ""
  })
});

router.post("/signUp", registerCtrl);;

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
