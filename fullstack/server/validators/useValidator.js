const { check, body } = require("express-validator");

exports.registerUserValidator = [
  check("firstName").notEmpty().withMessage("First name is required"),
  check("lastName").notEmpty().withMessage("Last name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/)
    .withMessage("Invalid phone number")
    .isLength({ min: 11, max: 11 })
    .withMessage("Phone number must be 11 digits"),

  check("location").notEmpty().withMessage("Location is required"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 9 })
    .withMessage("Password must be at least 9 characters long"),
];

exports.loginUserValidator = [
  check("email").isEmail().withMessage("Please enter a valid email").escape(),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .escape(),
];

exports.validateShuttleForm = [
  check('from').notEmpty().withMessage('From location is required'),
  check('to').notEmpty().withMessage('To location is required'),
  check('tripType')
    .notEmpty()
    .withMessage('Trip type is required')
    .isIn(['One-way', 'Return', 'Subscribe']),
  check('bookingType')
    .if(body('tripType').equals('Subscribe'))
    .notEmpty()
    .withMessage('Booking type is required for subscription'),
  check('departureTime')
    .if(body('tripType').equals('Subscribe'))
    .notEmpty()
    .withMessage('Departure time is required for subscription'),
  check('selectDays')
    .if(body('tripType').equals('Subscribe'))
    .isArray()
    .withMessage('Select days must be an array')
    .notEmpty()
    .withMessage('Select days are required for subscription'),
  check('durationInWeeks')
    .if(body('tripType').equals('Subscribe'))
    .isInt({ min: 1 })
    .withMessage('Duration in weeks must be a positive integer'),
];