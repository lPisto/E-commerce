const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mailer = require('../mailer');
const schedule = require("node-schedule");

const index = (req, res) => {
  if (req.session.loggedIn != true) {
    res.render("index", {
      logOutBtn: "displayNone",
      signUpBtn: "",
      loginBtn: "",
    });
  } else {
    res.render("index", {
      logOutBtn: "",
      signUpBtn: "displayNone",
      loginBtn: "displayNone",
    });
  }
};

const login = (req, res) => {
  if (req.session.loggedIn != true) {
    res.render("login", {
      loginError: "",
      errorTriangle: "",
    });
  }
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
  if (req.session.loggedIn == true) {
    req.session.destroy();
  }
  res.redirect("/");
};

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
                jwt.sign({ userData }, "secretkey", (err, token) => {
                  res.json({
                    token,
                  });
                });

                req.session.role = element.role;
                req.session.loggedIn = true;
                req.session.name = element.name;
                req.session.surname = element.surname;
                req.session.email = element.email;
                req.session.phone = element.phone;
                req.session.password = element.password;
                req.session.country = element.country;
                req.session.city = element.city;
                req.session.street = element.street;
                req.session.streetNumber = element.streetNumber;
                req.session.flat = element.flat;

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
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.render("cart");
    }
  });
};

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
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
                "INSERT INTO users (name, surname, email, phone, password, role) VALUES ('" +
                  name +
                  "','" +
                  surname +
                  "','" +
                  email +
                  "','" +
                  phone +
                  "','" +
                  password +
                  "','" +
                  "user" +
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
  if (req.session.role == "user") {
    res.render("settings", {
      changePasswordError: "displayNone",
      userName: req.session.name,
      userSurname: req.session.surname,
      userEmail: req.session.email,
      userPhone: req.session.phone,
    });
  } else res.redirect("/");
};

const updateAccount = (req, res) => {
  const data = req.body;
  const phone = data.phone;
  const email = req.session.email;
  const emailForm = data.email;
  const oldPasswordSession = req.session.password;
  const oldPasswordForm = data.oldPassword;
  const password = data.password;

  bcrypt.hash(password, 12).then((hash) => {
    const newPassword = hash;

    if (oldPasswordForm.length > 0) {
      bcrypt.compare(oldPasswordForm, oldPasswordSession, (err, isMatch) => {
        if (isMatch) {
          req.getConnection((err, conn) => {
            conn.query("UPDATE users SET password = ? WHERE email = ?;", [
              newPassword,
              email,
            ]);
          });
          res.redirect("/");
        } else {
          res.render("settings", {
            changePasswordError: "changePasswordError",
            settingsName: req.session.name,
            settingsSurname: req.session.surname,
            settingsEmail: req.session.email,
            settingsPhone: req.session.phone,
          });
        }
      });
    }
  });

  if (phone.length > 0) {
    req.getConnection((err, conn) => {
      conn.query("UPDATE users SET phone = ? WHERE email = ?;", [phone, email]);
    });
    res.redirect("/");
  }

  if (emailForm.length > 0) {
    req.getConnection((err, conn) => {
      conn.query("UPDATE users SET email = ? WHERE email = ?;", [
        emailForm,
        email,
      ]),
        conn.query("UPDATE details SET email = ? WHERE userEmail = ?;", [
          emailForm,
          email,
        ]);
    });
    res.redirect("/");
  }
};

const forgotPassword = (req, res) => {
  if (req.session.loggedIn != true) {
    res.render("forgotPassword", {
      emailError: "displayNone",
    });
  } else {
    res.redirect("/");
  }
};

const forgotPasswordEmail = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query(
      "SELECT * FROM users WHERE email = ?",
      [req.body.email],
      async (err, userData) => {
        if (userData.length > 0) {
          const token = crypto.randomBytes(20).toString("hex");

          conn.query("UPDATE users SET token = ? WHERE email = ?", [token, req.body.email]);

          resetUrl = "http://localhost:4000/resetPassword/" + token;

          await mailer.transporter.sendMail({
            from: '"Market" <lsoftware.development.testing@gmail.com>',
            to: req.body.email,
            subject: "Forgot your Password?",
            html: `
            <br>
            <b style="width: 100%; margin: 0 auto">Please click on the following button to change your password</b>
            <br> <br>
            <a href="${resetUrl}"  style="
            margin: 0 auto;
            color: #fff;
            text-decoration: none;
            background-color: #337ab7;
            border-color: #2e6da4;
            display: inline-block;
            margin-bottom: 0;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            background-image: none;
            border: 1px solid transparent;
            padding: 6px 12px;
            font-size: 14px;
            line-height: 1.42857143;
            border-radius: 4px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            ">Reset Password</a>
            <p>The link will expire in an hour</p>
            `,
          });

          const job = schedule.scheduleJob("* * */60 *", () => {
            conn.query(
              "UPDATE users SET token = ? WHERE email = ?", [null, req.body.email]
            )
            job.cancel()
          });
    
          res.redirect("/successForgotPassword");
        } else {
          res.render("forgotPassword", {
            emailError: "",
            errorTriangle: "fas fa-exclamation-triangle",
          });
        }
      }
    );
  });
};

const resetPassword = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query(
      "SELECT * FROM users WHERE token = ?", [req.params.token], (err, userData) => {
        if (userData.length > 0) {
          res.render("resetPassword", {
            token: req.params.token,
            changePasswordError: "displayNone"
          });
        } else {
          res.redirect("/login");
        }
      }
    )
  })
};

const changePassword = (req, res) => {
  const data = req.body;
  const password = data.password;
  const token = req.params.token;

  bcrypt.hash(password, 12).then((hash) => {
    const newPassword = hash;

    if (password.length > 0) {
      req.getConnection((err, conn) => {
        conn.query(
          "SELECT * FROM users WHERE token = ?", [token], (err, userData) => {
            if (userData.length > 0) {
              conn.query(
                "UPDATE users SET password = ? WHERE token = ?", [newPassword, token]
              );
              conn.query(
                "UPDATE users SET token = ? WHERE token = ?", [null, token]
              );
              res.redirect("/login");
            } else {
              res.redirect("/login");
            }
          }
        );
      });
    } else {
      res.render("resetPassword", {
        changePasswordError: "changePasswordError",
      });
    }
  });
}

//hacer validaciones visuales email forgotPassword y resetPassword

const adminPanel = (req, res) => {
  if (req.session.role == "admin") {
    res.render("adminPanel", {
      emailError: "displayNone",
    });
  } else {
    res.redirect("/");
  }
};

const modifyUserRole = (req, res) => {
  const data = req.body;
  const email = data.email;
  const role = data.role;

  req.getConnection((err, conn) => {
    conn.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      (err, userEmail) => {
        if (userEmail == "") {
          res.render("adminPanel", {
            emailError: "",
          });
        } else {
          conn.query("UPDATE users SET role = ? WHERE email = ?;", [
            role,
            email,
          ]),
            res.redirect("/");
        }
      }
    );
  });
};

module.exports = {
  login,
  signUp,
  logOut,
  storeUser,
  auth,
  index,
  updateAccount,
  forgotPassword,
  forgotPasswordEmail,
  resetPassword,
  changePassword,
  adminPanel,
  modifyUserRole,
  settings,
  adminRoute,
  verifyToken,
};
