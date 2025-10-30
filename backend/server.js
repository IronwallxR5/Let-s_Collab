const express = require("express");
const dotenv = require("dotenv");
const route = require("./routes");

dotenv.config();

const app = express();
const PORT = 3000;


app.use(express.json());


app.use("/", route);

app.listen(PORT, () => {
  console.log(`Server started`);
});

