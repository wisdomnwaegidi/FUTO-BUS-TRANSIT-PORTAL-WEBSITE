const { body } = require("express-validator");

exports.registerUserValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name must only contain letters"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name must only contain letters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/)
    .withMessage("Invalid phone number")
    .isLength({ min: 11, max: 11 })
    .withMessage("Phone number must be 11 digits"),

  body("location").notEmpty().withMessage("Location is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.loginUserValidator = [
  body("email").isEmail().withMessage("Please enter a valid email").escape(),
  body("password").not().isEmpty().withMessage("Password is required").escape(),
];
