const express = require("express");
const morgan = require("morgan");
const path = require("path");

// initialization
const app = express();

// settings
app.set("port", process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));

// global variables

// routes
app.use(require('./routes/routes.js'));

// public
app.use(express.static(path.join(__dirname, "public")));

// starting server
app.listen(app.get("port"), () => {
  console.log("listening on port " + app.get("port"));
});
