const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const route = require("./routes");

dotenv.config();

const app = express();
const PORT =  3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", route);


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
