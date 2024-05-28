const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./server/database/connection");
const path = require("path");
const cors = require("cors");
const router = require("./server/routes/router");

dotenv.config();
connectDB();

const app = express();
const PORT = Number(process.env.PORT) || 8081;

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.text());
app.set("view engine", "ejs");

// Serve static files
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/images", express.static(path.resolve(__dirname, "assets/images")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/favicon", express.static(path.resolve(__dirname, "assets/favicon")));
app.use("/fonts", express.static(path.resolve(__dirname, "assets/fonts")));

// Define routes
app.use("/", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});