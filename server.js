const express = require("express");
const cors = require("cors");

const StringRoutes = require("./routes/stringRouters");

const PORT = 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/", StringRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});
