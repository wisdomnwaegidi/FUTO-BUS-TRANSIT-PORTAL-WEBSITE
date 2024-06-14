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
} = require("../controller/userController");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { tickets, findTicket } = require("../controller/shuttleController");
const { validationResult } = require("express-validator");
const Userdb = require("../model/userModel");
const upload = require("../middleware/multer");
const verifyToken = require("../middleware/verifyToken");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    loggedIn: res.locals.loggedIn,
    user: res.locals.user || null,
    errors: [],
    data: {},
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

// route for random location
router.post("/userlocation", (req, res) => {
  res.status(200).send(`<div>registered your request</div>`);
});

// route for user to get charter bus
router.get("/usercharter", (req, res) => {
  res
    .status(200)
    .send(
      `<div style="color: green; width: 70%; margin: auto; text-align: center; font-size: 10rem;">Coming soon</div>`
    );
});

/* profile details */
// route to get user profile
router.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});

// route for updating user details with put request
router.put("/profile/:userId/details", async (req, res) => {
  const userId = req.params.userId;

  console.log("Received data:", req.body);
  console.log("User ID:", userId);

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

    /*  res.render("profile", {
      message: "Profile updated successfully",
      user: updatedUser,
    }); */

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .render("profile", { user: req.user, message: "Error updating profile" });
  }
});

//route to upload user profile picture
router.put("/profile/:userId/picture", upload, async (req, res) => {
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

    const updatedUser = await user.save();

    res.json({
      message: "Profile picture uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/forgot-password", async(req, res) =>{
  res.render("forgotpasswordv")
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Userdb.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiration;
    await user.save();

    const resetUrl = `http://localhost:5179/reset-password?token=${resetToken}`;

    // Send password reset email
    const transporter = nodemailer.createTransport({
      // Configure your transporter here
    });

    const mailOptions = {
      from: 'your-email@example.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n
             Please click on the following link or paste it into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset link has been sent to your email' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Missing token or new password' });
  }

  try {
    // Find user by reset token and check if the token is still valid
    const user = await Userdb.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and clear the reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;

