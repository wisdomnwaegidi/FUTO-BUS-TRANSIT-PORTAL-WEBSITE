const express = require("express");

const {
  registerUserValidator,
  loginUserValidator,
  validateShuttleForm,
  charter,
} = require("../validators/useValidator");

const {
  registerUser,
  loginUser,
  dashboard,
  logout,
  tickets,
  findTicket,
} = require("../controller/controller");

const { validationResult } = require("express-validator");

const Userdb = require("../model/userModel");

const upload = require("../middleware/multer");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    loggedIn: res.locals.loggedIn,
    user: res.locals.user || null,
  });
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

// login user to dashboard
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

// register user
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

// dashboard itself
router.get("/dashboard", verifyToken, dashboard);

router.get("/logout", logout);

router.post("/find-tickets", validateShuttleForm, (req, res, next) => {
  console.log(req.body);
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

// router for random location
router.post("/user-location", (req, res) => {
  res.status(200).send(`<div>registered your request</div>`);
});

// router for user to get charter bus
router.get("/user-charter", (req, res) => {
  res
    .status(200)
    .send(
      `<div style="color: green; width: 70%; margin: auto; text-align: center; font-size: 10rem;">Coming soon</div>`
    );
});

// router for updating user details
router.post("/profile/:id/details", async (req, res) => {
  const userId = req.params.id;

  const { firstName, lastName, email, address } = req.body;

  try {
    const updatedUser = await Userdb.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, address },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .render("profile", { user: req.user, message: "User not found" });
    }

    res.render("profile", {
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("profile", { user: req.user, message: "Error updating profile" });
  }
});

// Profile picture upload route
router.post("/profile/:userId/picture", upload, async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const userId = req.params.userId;

    const user = await Userdb.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.profilePicture = req.file.path;

    await user.save();

    res.json({ message: "Profile picture uploaded successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});

router.post("/charter", charter, async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phonenumber,
    from,
    to,
    pickuptime,
    returntime,
    passengers,
    stops,
  } = req.body;
  try {
    const location = await Userdb.findOne({ email });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).res.json({ error: error.message });
  }
});

module.exports = router;
