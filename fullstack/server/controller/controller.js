const Userdb = require("../model/userModel");
const bcrypt = require("bcrypt");
const ShuttleForm = require("../model/shuttleFormSchema");

async function fetchTickets(form) {
  // This is a placeholder function. Replace with actual logic to fetch tickets.
  return [
    {
      busNumber: "123",
      departureTime: "08:00 AM",
      arrivalTime: "10:00 AM",
      price: "$10",
    },
    {
      busNumber: "456",
      departureTime: "09:00 AM",
      arrivalTime: "11:00 AM",
      price: "$12",
    },
  ];
}

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
        console.log("Error saving session:", err);
        return res.status(500).render("register", {
          errors: [{ msg: "Server error while saving session" }],
          data: req.body,
        });
      }
      console.log("Session saved successfully");
      return res.status(201).render("dashboard", { user: data });
    });
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

    req.session.user = user;

    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).render("login", {
          errors: [{ msg: "Server error while saving session" }],
          data: req.body,
        });
      }

      return res.status(200).render("dashboard", { user });
    });
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

exports.findTicket = async (req, res) => {
  try {
    const shuttleForm = new ShuttleForm(req.body);
    await shuttleForm.save();
    res.redirect(`/tickets/${shuttleForm._id}`);
  } catch (error) {
    res.status(400).render("/", {
      errors: [{ msg: "internal server error" }],
      data: req.body,
    });
  }
};

exports.tickets = async (req, res) => {
  try {
    const form = await ShuttleForm.findById(req.params.id);
    if (!form) {
      return res.status(404).send("Form not found");
    }
    // For demonstration, we'll just send the form data. Replace this with your logic to fetch tickets.
    res.render("tickets", { form });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
