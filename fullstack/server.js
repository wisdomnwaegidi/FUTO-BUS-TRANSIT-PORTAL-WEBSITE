const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./server/database/connection");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./server/routes/router");
const helmet = require("helmet");
const verifyToken = require("./server/middleware/verifyToken");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

connectDB();

app.use(cookieParser());
app.use(verifyToken);

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline'");
  next();
});

app.use("/", (req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline'");
  next();
});

app.use(morgan("tiny"));

app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/images", express.static(path.resolve(__dirname, "assets/images")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/favicon", express.static(path.resolve(__dirname, "assets/favicon")));
app.use("/fonts", express.static(path.resolve(__dirname, "assets/fonts")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", router);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
