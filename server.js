const express = require("express");
const cors = require("cors");

const StringRoutes = require("./routes/stringRouters");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req,res) => { 
  res.json({ message: 'Hello world'})})

app.use("/", StringRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});
