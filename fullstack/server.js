const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./server/database/connection");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const router = require("./server/routes/router");
const MongoStore = require("connect-mongo");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/session_db",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds 24 * 60 * 60 * 1000
      httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
      secure: false, // Set to true if using HTTPS
    },
  })
);

const isLoggedIn = (req, res, next) => {
  console.log("isLoggedIn middleware: req.session:", req.session);
  if (req.session && req.session.user) {
    res.locals.loggedIn = true;
  } else {
    res.locals.loggedIn = false;
  }
  next();
};

app.use(isLoggedIn);

app.use(morgan("tiny"));

app.set("view engine", "ejs");
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/images", express.static(path.resolve(__dirname, "assets/images")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/favicon", express.static(path.resolve(__dirname, "assets/favicon")));
app.use("/fonts", express.static(path.resolve(__dirname, "assets/fonts")));

app.use("/", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
