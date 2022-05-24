const bcrypt = require("bcryptjs");

const login = (req, res) => {
  if (req.session.loggedIn != true) {
    res.render("login", {
        loginError: "",
        errorTriangle: "",
      });
  } else {
    res.redirect("/");
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

module.exports = {
  login,
  signUp,
  logOut,
  storeUser,
  auth,
};
