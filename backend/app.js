require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./configs/db.js");



const app = express();

connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");



app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

// ==========================
// ROUTES
// ==========================


app.use("/api/auth", authRoutes);

app.use("/api/reviews", reviewRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port http://localhost:${PORT}`);
});