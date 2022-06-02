const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const session = require("express-session");
const bodyParser = require("body-parser");
require('newrelic');

// initialization
const app = express();

// settings
app.set("port", process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(myConnection(mysql, {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'ecommerce',
}, 'single'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// routes
app.use(require('./routes/routes.js'));

// public
app.use(express.static(path.join(__dirname, "public")));

// starting server
app.listen(app.get("port"), () => {
  console.log("listening on port " + app.get("port"));
});
