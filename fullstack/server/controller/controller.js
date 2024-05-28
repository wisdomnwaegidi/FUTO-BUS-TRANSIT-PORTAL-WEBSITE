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

    return res.status(201).render("dashboard", { user: data });
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    });

    return res.status(200).render("dashboard", { user });
  } catch (error) {
    console.error(error);
    return res.status(500).render("login", {
      errors: [{ msg: "Internal server error" }],
      data: req.body,
    });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const user = await Userdb.findById(req.userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout =
  ("/logout",
  (req, res) => {
    res.cookie("auth_token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.redirect("/login");
  });

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
