const controller = {};

// Users 
controller.purchased = (req, res) => {
  res.redirect("/success")
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
