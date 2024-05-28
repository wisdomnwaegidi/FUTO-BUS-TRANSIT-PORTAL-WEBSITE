const express = require("express");
const controller = require("../controller/controller");
const verifyToken = require("../auth/authenticated");
const {
  registerUserValidator,
  loginUserValidator,
} = require("../validators/useValidator");
const {
  registerUser,
  loginUser,
  dashboard,
  logout,
  submit,
  tickets,
} = require("../controller/controller");
const { validationResult } = require("express-validator");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
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
router.get("/login", (req, res) => {
  res.render("login", { errors: [], data: {} });
});
router.get("/FAQ", (req, res) => {
  res.render("FAQ");
});
router.get("/register", (req, res) => {
  res.render("register", { errors: [], data: {} });
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
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
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

router.get("/logout", logout);
router.post("/api/submit", submit);
router.get("/api/auth/dashboard", verifyToken, dashboard);

module.exports = router;

/*router.get('/api/tickets/:region', controller.tickets);
 router.get('/api/user', controller.find);
router.put('/api/user/:id', controller.update);
router.delete('/api/user/:id', controller.delete); */
