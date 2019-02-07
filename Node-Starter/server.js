// import global modules here
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// Create routes to routes folder; use routes is on line 45.
const index = require('./routes/index')
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// Require express application.
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config to get keys for heroku
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.connect(
  "mongodb://User:Password@ds111111.mlab.com:11111/database",
  { useNewUrlParser: true }
);
mongoose.connection
  .once("open", function() {
    console.log("MongoDB connection has been made! \n");
  })
  .on("error", function(error) {
    console.log("Error is: ", error);
  });

// return a hello world on the home page.
// app.get('/', (req, res) => res.render('hello world'));
// app.get("/", function(req, res) {
//   res
//     .header("Content-Type", "text/html")
//     .send(
//       "<h1>Hello World</h1><ul><li>I am working on this application.</li><li>Getting backend set up before front end</li></ul>"
//     );
// });

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// points to file in routes folder
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use('/', index);

// port of the local server is run on
const port = process.env.PORT || 5000;

// start the server and log the output to the console.
app.listen(port, () => console.log(`Server running on port ${port}`));
