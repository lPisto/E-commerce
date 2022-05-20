const registerCtrl = (req, res) => {
  if (req.body.password.length < 4) {
    res.render("signUp", {
      wrongPass: "The password must be at least 4 characters long",
    });
  } else {
    res.render("signUp", {
      wrongPass: "",
    });
  }
};

module.exports = { registerCtrl };
