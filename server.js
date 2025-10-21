const express = require("express");
const cors = require("cors");

const StringRoutes = require("./routes/stringRouters");

const PORT = 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "String Analysis Server is running!",
    endpoint: "POST /api/string/analyze",
  });
});

app.use("/", StringRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});
