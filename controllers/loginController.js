const bcrypt = require('bcryptjs');

const storeUser = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userData) => {
            if (userData.length > 0) {
                res.render('signUp', {
                    userExists: "User already exists!",
                    errorTriangle: "fas fa-exclamation-triangle"
                })
            } else {
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;
                    
                    const name = data.name;
                    const surname = data.surname;
                    const email = data.email;
                    const phone = data.phone;
                    const password = data.password;
            
                    req.getConnection((err, conn) => {
                        conn.query("INSERT INTO users (name, surname, email, phone, password) VALUES ('"+name+"','"+surname+"','"+email+"','"+phone+"','"+password+"')")
                        res.redirect('login')
                    });
                });   
            };
        });
    }); 
};

module.exports = {
    storeUser
}