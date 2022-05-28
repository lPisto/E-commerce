const controller = {};
const mercadopago = require("mercadopago");

// Users

// Payment
mercadopago.configure({
    access_token: "TEST-4244969390240596-052801-6fd8c5a2f40fe10f16c4f30bccd50766-564636510",
});

controller.purchased = (req, res) => {
  let preference = {
    // modificar items con los productos
    items: [
      {
        title: "Mi producto",
        unit_price: 100,
        quantity: 1,
      },
    ],
  };

  mercadopago.preferences.create(preference)
  .then(function (response) {
    res.redirect(response.body.init_point)
    console.log(response.body)
  })
  .catch(function (error) {
    console.log(error);
  });
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
