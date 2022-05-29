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
                jwt.sign({userData}, 'secretkey', (err, token) => {
                  res.json({
                    token
                  })
                })
                
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

const adminRoute = (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403)
    } else {
      res.render("cart")
    }
  })
}

function verifyToken(req, res, next){
  const bearerHeader =  req.headers['authorization'];

  if(typeof bearerHeader !== 'undefined'){
       const bearerToken = bearerHeader.split(" ")[1];
       req.token  = bearerToken;
       next();
  }else{
      res.sendStatus(403);
  }
}

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
                "INSERT INTO users (name, surname, email, phone, password, role) VALUES ('" + name + "','" + surname + "','" + email + "','" + phone + "','" + password + "','" + "user" + "')"
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
    changePasswordError: "displayNone",
    settingsName: req.session.name,
    settingsSurname: req.session.surname,
    settingsEmail: req.session.email,
    settingsPhone: req.session.phone
  });
}

const updateAccount = (req, res) => {
  const data = req.body;
  const phone = data.phone 
  const email = req.session.email;
  const emailForm = data.email;
  const oldPasswordSession = req.session.password;
  const oldPasswordForm = data.oldPassword;
  const password = data.password;

  bcrypt.hash(password, 12).then((hash) => {
    const newPassword = hash;

    if (oldPasswordForm.length > 0) {
      bcrypt.compare(oldPasswordForm, oldPasswordSession, (err, isMatch) => {
      if(isMatch) {
        req.getConnection((err, conn) => {
          conn.query("UPDATE users SET password = ? WHERE email = ?;", 
          [newPassword, email]
          )
        })
        res.redirect("/")
      } else {
        res.render("settings", {
          changePasswordError: "changePasswordError",
          settingsName: req.session.name,
          settingsSurname: req.session.surname,
          settingsEmail: req.session.email,
          settingsPhone: req.session.phone
        });
      }
    })
    }
    
  })

  if(phone.length > 0) {
    req.getConnection((err, conn) => {
      conn.query("UPDATE users SET phone = ? WHERE email = ?;", 
      [phone, email]
      )
    })
  }

  if(emailForm.length > 0) {
    req.getConnection((err, conn) => {
      conn.query("UPDATE users SET email = ? WHERE email = ?;", 
      [emailForm, email]
      )
    })
  }
}


module.exports = {
  login,
  signUp,
  logOut,
  storeUser,
  auth,
  index,
  updateAccount,
  settings,
  adminRoute,
  verifyToken
};
