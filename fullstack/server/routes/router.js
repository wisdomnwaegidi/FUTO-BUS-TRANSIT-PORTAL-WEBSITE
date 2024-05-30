const express = require("express");
const {
  registerUserValidator,
  loginUserValidator,
  validateShuttleForm,
} = require("../validators/useValidator");
const {
  registerUser,
  loginUser,
  dashboard,
  logout,
  tickets,
  requireAuth,
  findTicket,
} = require("../controller/controller");
const { validationResult } = require("express-validator");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { loggedIn: res.locals.loggedIn, errors: [], data: {} });
});

router.get("/charter", (req, res) => {
  res.render("charter");
});
router.get("/partnership", (req, res) => {
  res.render("partnership");
});
router.get("/route", (req, res) => {
  res.render("route");
});
router.get("/driver", (req, res) => {
  res.render("driver");
});

router.get("/FAQ", (req, res) => {
  res.render("FAQ");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});
router.get("/privacypolicy", (req, res) => {
  res.render("privacypolicy");
});
router.get("/tickets", (req, res) => {
  res.render("tickets");
});

router.get("/login", (req, res) => {
  res.render("login", { errors: [], data: {} });
});

router.post("/login", loginUserValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("login", {
      errors: errors.array(),
      data: req.body,
    });
  }
  loginUser(req, res, next);
});

router.get("/register", (req, res) => {
  res.render("register", { errors: [], data: {} });
});

router.post("/register", registerUserValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("register", {
      errors: errors.array(),
      data: req.body,
    });
  }
  registerUser(req, res, next);
});

router.get("/logout", logout);

router.get("/dashboard", requireAuth, dashboard);

router.post("/find-tickets", validateShuttleForm, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("index", {
      errors: errors.array(),
      data: req.body,
    });
  }
  findTicket(req, res, next);
});

router.get("/tickets/:id", tickets);

router.post("/location", (req, res) => {
  res.status(200).send(`<div>registered your request</div>`);
});

module.exports = router;
