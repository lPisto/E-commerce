const controller = {};
const e = require("connect-flash");
const mercadopago = require("mercadopago");

let preference = {
  items: [],
  back_urls: {
    success: "localhost:4000/",
  },
  auto_return: "approved",
};

// Users

// Products
controller.products = (req, res) => {
  res.render("products");
};

// Payment
mercadopago.configure({
  access_token:
    "TEST-4244969390240596-052801-6fd8c5a2f40fe10f16c4f30bccd50766-564636510",
});

controller.purchased = (req, res) => {
  // Setting user shipment information
  const data = req.body;
  if (data.country || data.city || data.street || data.streetNumber || data.flat || data.description !== '') {
    req.session.country = data.country;
    req.session.city = data.city;
    req.session.street = data.street;
    req.session.streetNumber = data.streetNumber;
    req.session.flat = data.flat;
    req.session.description = data.description;
  }

  const email = req.session.email;
  const country = data.country;
  const city = data.city;
  const street = data.street;
  const streetNumber = data.streetNumber;
  const flat = data.flat;

  if (data.country !== "") {
    req.getConnection((err, conn) => {
      conn.query("UPDATE users SET country = ? WHERE email = ?;", [
        country,
        email,
      ]);
    });
  }

  if (data.city !== "") {
    req.getConnection((err, conn) => {
      conn.query("UPDATE users SET city = ? WHERE email = ?;", [city, email]);
    });
  }

  if (data.street !== "") {
    req.getConnection((err, conn) => {
      conn.query("UPDATE users SET street = ? WHERE email = ?;", [
        street,
        email,
      ]);
    });
  }

  if (data.streetNumber !== "") {
    req.getConnection((err, conn) => {
      conn.query("UPDATE users SET streetNumber = ? WHERE email = ?;", [
        streetNumber,
        email,
      ]);
    });
  }

  if (data.flat !== "") {
    req.getConnection((err, conn) => {
      conn.query("UPDATE users SET flat = ? WHERE email = ?;", [flat, email]);
    });
  }

  // Proceed to checkout
  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      if (req.session.loggedIn == true) {
        res.redirect(response.body.init_point);

        // Payer information
        response.body.payer.email = req.session.email;
        response.body.payer.name = req.session.name;
        response.body.payer.surname = req.session.surname;
        response.body.payer.phone.number = req.session.phone;
        response.body.payer.address.country = req.session.country;
        response.body.payer.address.city = req.session.city;
        response.body.payer.address.street_name = req.session.street;
        response.body.payer.address.street_number = req.session.streetNumber;
        response.body.payer.address.flat = req.session.flat;
        response.body.payer.address.description = req.session.description;

        // Shipment information
        response.body.shipments.receiver_address.street_name =
          req.session.street;
        response.body.shipments.receiver_address.street_number =
          req.session.streetNumber;
        response.body.shipments.receiver_address.apartment = req.session.flat;
        response.body.shipments.receiver_address.city_name = req.session.city;
        response.body.shipments.receiver_address.country_name =
          req.session.country;

        // Product information
        let totalAmount = 0;
        for (let i = 0; i < response.body.items.length; i++) {
          const unitPrice = response.body.items[i].unit_price;
          const quantity = response.body.items[i].quantity;
          totalAmount = totalAmount + unitPrice * quantity;
        }
        response.body.total_amount = totalAmount;

        // Update products DB
        for (let i = 0; i < response.body.items.length; i++) {
          req.getConnection((err, conn) => {
            conn.query(
              "SELECT * FROM products WHERE id = ?",
              [response.body.items[i].id],
              (err, productData) => {
                for (let i = 0; i < productData.length; i++) {
                  const stockQuantity = Number(productData[i].quantity);
                  for (let i = 0; i < response.body.items.length; i++) {
                    const itemQuantity = response.body.items[i].quantity;
                    newStockQuantity = stockQuantity - itemQuantity;

                    conn.query(
                      "UPDATE products SET quantity = ? WHERE id = ?;",
                      [newStockQuantity, response.body.items[i].id]
                    );
                  }
                }
              }
            );
          });
        }

        // Updating the purchase database
        console.log(response.body) 
        var data = response.body       

        req.getConnection((err, conn) => {
          // Details
          conn.query("INSERT INTO details SET ?", [data.payer.email], (err, result) => {
            if (err) {
              err;
            } 
          });

          // Shipment
          conn.query("INSERT INTO shipment SET ?", [data.payer.address.country, data.payer.address.city, data.payer.address.street_name, data.payer.address.street_number, data.payer.address.flat, data.payer.address.description], (err, result) => {
            if (err) {
              err;
            } 
          });

          // Payment
          conn.query("INSERT INTO payment SET ?", [data.id, data.client_id, data.collector_id, data.date_created, data.total_amount], (err, result) => {
            if (err) {
              err;
            } 
          });

          // Sold Products
          for (let i = 0; i < data.items.length; i++) {
            conn.query("INSERT INTO soldProducts SET ?", [data.items[i].id, data.items[i].title, data.items[i].unit_price, data.items[i].quantity], (err, result) => {
              if (err) {
                err;
              } 
            });
          }
        });

      } else {
        res.redirect("/login");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Shipment
controller.shipment = (req, res) => {
  const userName = req.session.name;
  const userSurname = req.session.surname;
  const userEmail = req.session.email;
  const userPhone = req.session.phone;
  const userCountry = req.session.country;
  const userCity = req.session.city;
  const userStreet = req.session.street;
  const userNumber = req.session.streetNumber;
  const userFlat = req.session.flat;

  if (req.session.loggedIn == true) {
    if (
      (userCountry &&
        userCity &&
        userStreet &&
        userNumber &&
        userFlat !== undefined) ||
      (userCountry && userCity && userStreet && userNumber && userFlat !== "")
    ) {
      res.render("shipment", {
        userName: userName,
        userSurname: userSurname,
        userEmail: userEmail,
        userPhone: userPhone,
        userCountry: userCountry,
        userCity: userCity,
        userStreet: userStreet,
        userNumber: userNumber,
        userFlat: userFlat,
      });
    } else {
      res.render("shipment", {
        userName: userName,
        userSurname: userSurname,
        userEmail: userEmail,
        userPhone: userPhone,
        userCountry: "Country",
        userCity: "City",
        userStreet: "Street",
        userNumber: "Number",
        userFlat: "Flat",
      });
    }
  } else {
    res.redirect("login");
  }
};

controller.details = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query(
      "SELECT * FROM products WHERE name = ?",
      [req.body.name],
      (err, productData) => {
        for (let i = 0; i < productData.length; i++) {
          preference.items.push({
            id: productData[i].id,
            title: req.body.name,
            unit_price: Number(req.body.price),
            quantity: Number(req.body.quantity),
          });
        }
      }
    );
  });
};

// Admin
controller.list = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM products", (err, products) => {
      if (err) {
        res.json(err);
      }
      res.render("adminProducts", {
        data: products,
      });
    });
  });
};

controller.save = (req, res) => {
  const data = req.body;
  req.getConnection((err, conn) => {
    conn.query("INSERT INTO products SET ?", [data], (err, result) => {
      if (err) {
        err;
      } else {
        res.redirect("adminProducts");
      }
    });
  });
};

controller.edit = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
      res.render("adminProductsEdit", {
        data: result[0],
      });
    });
  });
};

controller.update = (req, res) => {
  const { id } = req.params;
  const newProduct = req.body;
  req.getConnection((err, conn) => {
    conn.query(
      "UPDATE products set ? WHERE id = ?",
      [newProduct, id],
      (err, result) => {
        res.redirect("../adminProducts");
      }
    );
  });
};

controller.delete = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
      res.redirect("adminProducts");
    });
  });
};

module.exports = controller;
