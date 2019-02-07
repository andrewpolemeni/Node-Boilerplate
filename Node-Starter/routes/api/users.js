const express = require("express"); // npm express library to serve web pages
const router = express.Router(); // brings in router
const gravatar = require("gravatar"); // npm libary for avatars
const bcrypt = require("bcryptjs"); // npm libary to hash passwords
const jwt = require("jsonwebtoken"); //
const keys = require("../../config/keys"); // brings in JWT keys from config folder / keys.js file
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../Validation/register");
const validateLoginInput = require('../../Validation/login')

// Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   GET api/users/register
// @desc    Registers the user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation if empty
  if(!isValid){
    return res.status(400).json(errors);
  }

  // Check validation in database
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      // Gravatar
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      // Salt the password with bycrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//  @route  GET api/users/login
//  @desc   Login User  / Returning JWT Token
//  @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation if empty
  if(!isValid){
    return res.status(400).json(errors);
  } 

  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const jsonTokenPayload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }; // Create json web token payload

        // Sign Token
        jwt.sign(
          jsonTokenPayload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (_err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
            console.log(_err);
          }
        );
      } else {
        errors.password = "Incorrect password" 
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private (This method protects the users route unless logged in)
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

// exports users to the router
module.exports = router;
