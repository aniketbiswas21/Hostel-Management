const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.phoneno = !isEmpty(data.phoneno) ? data.phoneno : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.hostel = !isEmpty(data.hostel) ? data.hostel : "";
  data.role = !isEmpty(data.role) ? data.role : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 Characters";
  }

  if (!Validator.isAlphanumeric(data.name)) {
    errors.name = "Only Alphabets and numbers Allowed.";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name Field is Required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email Field is Required";
  }

  if (
    Validator.isEmpty(data.phoneno) ||
    Validator.isLength(data.phoneno, { max: 10, min: 10 })
  ) {
    errors.phoneno = "Enter a valid phone number";
  }

  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = "Password must be 8 characters long";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required.";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Password must be same";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password is required.";
  }

  if (Validator.isEmpty(data.role)) {
    errors.password2 = "Role is required.";
  }

  if (Validator.isEmpty(data.hostel)) {
    errors.password2 = "Hostel is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
