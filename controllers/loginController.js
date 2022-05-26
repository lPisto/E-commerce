const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const index = (req, res) => {
  if (req.session.loggedIn != true) {
    res.render("index", { 
      logOutBtn: "displayNone",
      signUpBtn: "",
      loginBtn: ""
    });
  } else {
    res.render("index", { 
      logOutBtn: "",
      signUpBtn: "displayNone",
      loginBtn: "displayNone"
    });
  }
}

const login = (req, res) => {
  if (req.session.loggedIn != true) {
    res.render("login", {
        loginError: "",
        errorTriangle: ""
    });
  };
};

const signUp = (req, res) => {
  if (req.session.loggedIn != true) {
    res.render("signUp", {
        userExists: "",
        errorTriangle: "",
      });
  } else {
    res.redirect("/");
  }
};

const logOut = (req, res) => {
  if(req.session.loggedIn == true) {
    req.session.destroy();
  }
  res.redirect('/')
}

const auth = (req, res) => {
  const data = req.body;
  req.getConnection((err, conn) => {
    conn.query(
      "SELECT * FROM users WHERE email = ?",
      [data.email],
      (err, userData) => {
        if (userData.length > 0) {
          userData.forEach((element) => {
            bcrypt.compare(data.password, element.password, (err, isMatch) => {
              if (!isMatch) {
                res.render("login", {
                  loginError: "The email and password do not match",
                  errorTriangle: "fas fa-exclamation-triangle",
                });
              } else {
                req.session.loggedIn = true;
                req.session.name = element.name;
                req.session.surname = element.surname;
                req.session.email = element.email;
                req.session.phone = element.phone;
                req.session.password = element.password;

                res.redirect("/");
              }
            });
          });
        } else {
          res.render("login", {
            loginError: "User not exists!",
            errorTriangle: "fas fa-exclamation-triangle",
          });
        }
      }
    );
  });
};

const storeUser = (req, res) => {
  const data = req.body;

  req.getConnection((err, conn) => {
    conn.query(
      "SELECT * FROM users WHERE email = ?",
      [data.email],
      (err, userData) => {
        if (userData.length > 0) {
          res.render("signUp", {
            userExists: "User already exists!",
            errorTriangle: "fas fa-exclamation-triangle",
          });
        } else {
          bcrypt.hash(data.password, 12).then((hash) => {
            data.password = hash;

            const name = data.name;
            const surname = data.surname;
            const email = data.email;
            const phone = data.phone;
            const password = data.password;

            req.getConnection((err, conn) => {
              conn.query(
                "INSERT INTO users (name, surname, email, phone, password) VALUES ('" +
                  name +
                  "','" +
                  surname +
                  "','" +
                  email +
                  "','" +
                  phone +
                  "','" +
                  password +
                  "')"
              );
              res.redirect("login");
            });
          });
        }
      }
    );
  });
};

const settings = (req, res) => {
  res.render("settings", {
    passwordError: "",
    errorTriangle: "",
    settingsName: req.session.name,
    settingsSurname: req.session.surname,
    settingsEmail: req.session.email,
    settingsPhone: req.session.phone,
  });
}

const updateAccount = (req, res) => {
  const data = req.body;
  const email = req.session.email;
  const oldPasswordSession = req.session.password;
  const oldPasswordForm = data.oldPassword;
  const password = data.newPassword;

  bcrypt.hash(password, 12).then((hash) => {
    const newPassword = hash;

    bcrypt.compare(oldPasswordForm, oldPasswordSession, (err, isMatch) => {
      if(isMatch) {
        req.getConnection((err, conn) => {
          conn.query("UPDATE users SET password = ? WHERE email = ?;", 
          [newPassword, email]
          )
        })
      } else {
        res.render("settings", {
          passwordError: "The password do not match",
          errorTriangle: "fas fa-exclamation-triangle"
        });
      }
    })
  })

  
}


module.exports = {
  login,
  signUp,
  logOut,
  storeUser,
  auth,
  index,
  updateAccount,
  settings
};
