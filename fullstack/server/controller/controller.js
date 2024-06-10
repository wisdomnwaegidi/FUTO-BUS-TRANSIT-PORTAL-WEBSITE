const Userdb = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ShuttleForm = require("../model/shuttleFormSchema");

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, location, password } =
    req.body;

  try {
    const userMail = await Userdb.findOne({ email });
    if (userMail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const userNumber = await Userdb.findOne({ phoneNumber });
    if (userNumber) {
      return res
        .status(400)
        .json({ message: "Phone number is already registered" });
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

    const token = jwt.sign({ userId: data._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000, // 1 day
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating user" });
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
      console.error("Incorrect password for email:", email);
      return res.status(401).render("login", {
        errors: [{ msg: "Incorrect password" }],
        data: req.body,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    return res.status(200).render("dashboard", { user });
    // res.status(200).json({ message: "User loggedin successfully" });
  } catch (error) {
    console.error("Error logging in:", error.message);
    console.error(error.stack);
    return res.status(500).render("login", {
      errors: [{ msg: "Internal server error" }],
      data: req.body,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.redirect("/");
};

exports.dashboard = (req, res) => {
  res.render("dashboard", { user: req.user });
};

exports.findTicket = async (req, res) => {
  try {
    const shuttleForm = new ShuttleForm(req.body);
    await shuttleForm.save();
    // res.redirect(`/tickets/${shuttleForm._id}`);
    res.send("Form submitted successfully");
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
