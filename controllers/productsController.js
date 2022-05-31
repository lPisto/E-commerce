const controller = {};
const e = require( "connect-flash" );
const mercadopago = require("mercadopago");

// Users

// Payment
mercadopago.configure({
    access_token: "TEST-4244969390240596-052801-6fd8c5a2f40fe10f16c4f30bccd50766-564636510",
});

controller.purchased = (req, res) => {
  // Setting user shipment information
  const data = req.body;

  const email = req.session.email
  const country = data.country 
  const city = data.city 
  const street = data.street 
  const streetNumber = data.streetNumber 
  const flat = data.flat 
  const description = data.description

  if(data.country !== ''){
    req.getConnection((err, conn) => {
      conn.query(
        "UPDATE users SET country = ? WHERE email = ?;", 
        [country, email]
      )
    })
  }
    
  if(data.city !== '') {
    req.getConnection((err, conn) => {
      conn.query(
        "UPDATE users SET city = ? WHERE email = ?;", 
        [city, email]
      )
    })
  }
  
  if(data.street !== '') {
    req.getConnection((err, conn) => {
      conn.query(
        "UPDATE users SET street = ? WHERE email = ?;", 
        [street, email]
      )
    })
  }
  
  if(data.streetNumber !== '') {
    req.getConnection((err, conn) => {
      conn.query(
        "UPDATE users SET streetNumber = ? WHERE email = ?;", 
        [streetNumber, email]
      )
    })
  }
  
  if(data.flat !== '') {
    req.getConnection((err, conn) => {
      conn.query(
        "UPDATE users SET flat = ? WHERE email = ?;", 
        [flat, email]
      )
    })
  }

  // Proceed to checkout
  let preference = {
    // NOTA: modificar items con los productos
    items: [
      {
        title: "Mi producto",
        unit_price: 100,
        quantity: 1,
      },
    ],
    "back_urls": {
      "success": "localhost:4000/"
    },
    "auto_return": "approved",
  };

  mercadopago.preferences.create(preference)
  .then(function (response) {
    if (req.session.loggedIn == true) {
      res.redirect(response.body.init_point)
      // console.log(data)

      // Payer information
      response.body.payer.email = req.session.email
      response.body.payer.name = req.session.name
      response.body.payer.surname = req.session.surname
      response.body.payer.phone.number = req.session.phone
      response.body.payer.address.country = req.session.country
      response.body.payer.address.city = req.session.city
      response.body.payer.address.street_name = req.session.street
      response.body.payer.address.street_number = req.session.streetNumber
      response.body.payer.address.flat = req.session.flat

      // Shipment information
      response.body.shipments.receiver_address.street_name = req.session.street
      response.body.shipments.receiver_address.street_number = req.session.streetNumber
      response.body.shipments.receiver_address.apartment = req.session.flat
      response.body.shipments.receiver_address.city_name = req.session.city
      response.body.shipments.receiver_address.country_name = req.session.country

      // Product information
      let totalAmount = 0
      for (let i = 0; i < response.body.items.length; i++) {
        const unitPrice = response.body.items[i].unit_price
        const quantity = response.body.items[i].quantity
        totalAmount = totalAmount + (unitPrice * quantity)
      }
      response.body.total_amount = totalAmount;
      // console.log(response.body)
    } else {
      res.redirect("/login")
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

// Shipment
controller.shipment = (req, res) => {
  // console.log(req.session)
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
    if(userCountry && userCity && userStreet && userNumber && userFlat !== undefined || userCountry && userCity && userStreet && userNumber && userFlat !== '') {
      res.render("shipment", {
        userName: userName,
        userSurname: userSurname,
        userEmail: userEmail,
        userPhone: userPhone,
        userCountry: userCountry,
        userCity: userCity,
        userStreet: userStreet,
        userNumber: userNumber,
        userFlat: userFlat
      })
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
        userFlat: "Flat"
        })
    }
  } else {
    res.redirect("login")
  }
}

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
        console.log(err);
      } else {
        res.redirect("adminProducts");
      }
    });
  });
};

controller.edit = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM products WHERE id = ?', [id], (err, result) => {
      res.render('adminProductsEdit', {
        data: result[0]
      });
    });
  });
};

controller.update = (req, res) => {
  const { id } = req.params;
  const newProduct = req.body;
  req.getConnection((err, conn) => {
    conn.query("UPDATE products set ? WHERE id = ?", [newProduct, id], (err, result) => {
      res.redirect("../adminProducts");
    });
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
