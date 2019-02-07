const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // check if its acutally an EMAIL.
  if (!Validator.isEmail(data.email)) {
    errors.email = "Not a valid email address.";
  }
  // checks EMAIL field if empty
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required.";
  }
  // check if PASSWORD is empty.
  if (Validator.isEmpty(data.password)) {
    errors.password = "Not a valid password.";
  }
  // check if PASSWORD is empty.
  if (!Validator.isLength(data.password, { min: 8, max: 30})) {
    errors.password = "Password must be a minimum of 8 characters.";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
