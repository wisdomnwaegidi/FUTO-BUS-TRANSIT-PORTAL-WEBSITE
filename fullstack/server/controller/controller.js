const Userdb = require("../model/userModel");
const bcrypt = require("bcrypt");
const location = require("../model/modelforautocomplete");
const Ticket = require("../model/ticketmodel");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, location, password } =
    req.body;

  try {
    const userMail = await Userdb.findOne({ email });
    if (userMail) {
      return res.status(400).render("register", {
        errors: [{ msg: "Email already registered" }],
        data: req.body,
      });
    }

    const userNumber = await Userdb.findOne({ phoneNumber });
    if (userNumber) {
      return res.status(400).render("register", {
        errors: [{ msg: "Phone number is already registered" }],
        data: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Userdb({
      firstName,
      lastName,
      email,
      phoneNumber,
      location,
      password: hashedPassword,
    });

    const data = await user.save();

    req.session.user = data;

    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).render("register", {
          errors: [{ msg: "Server error while saving session" }],
          data: req.body,
        });
      }
      // Session saved successfully
      console.log("Session saved successfully");
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).render("register", {
      errors: [{ msg: "Server error while creating user" }],
      data: req.body,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Userdb.findOne({ email });

    if (!user) {
      return res.status(401).render("login", {
        errors: [{ msg: "Incorrect email or username" }],
        data: req.body,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).render("login", {
        errors: [{ msg: "Incorrect password" }],
        data: req.body,
      });
    }

    // Set session user data
    req.session.user = user;

    return res.status(200).render("dashboard", { user });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).render("login", {
      errors: [{ msg: "Internal server error" }],
      data: req.body,
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).redirect("/");
    }

    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};

// Middleware to protect the dashboard route
exports.requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/login");
};

exports.dashboard = async (req, res) => {
  try {
    const user = await Userdb.findById(req.session.user._id).select(
      "-password"
    );
    res.status(200).render("dashboard", { user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Endpoint to handle form submission
exports.submit = async (req, res) => {
  // Extract the fields from the request body
  const { input1, input2, dateTime } = req.body;

  // Validate the required fields
  if (!input1 || !input2 || !dateTime) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    // Create a new Location object
    const locationOne = new location({
      input1,
      input2,
      dateTime,
    });

    const ticketsAvailable = tickets();

    // Save the new location to the database
    const locationData = await locationOne.save();

    // Send a success response
    console.log("Location created:", locationData);
    return res.render("tickets", { locationOne: locationData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error occurred while creating location" });
  }
};

// Define API endpoint to get tickets for a region
exports.tickets = (req, res) => {
  const region = req.params.region; // Get the region parameter from the URL
  // Query MongoDB to fetch tickets for the specified region
  Ticket.find({ region: region })
    .then((tickets) => {
      // Return the tickets as a JSON response
      res.json(tickets);
    })
    .catch((error) => {
      console.error("Failed to fetch tickets from MongoDB:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    });
  // Return the tickets as a JSON response
  const tickets = getTicketsForRegion(region); // Replace with your own logic to fetch tickets
  res.json(tickets);
};
