const express = require("express");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS, GET");
  next();
});
app.use(authRoutes);

app.get("/tableau", authenticateToken, (req, res) => {
  res.send("You now have access to the tableau");
});

function authenticateToken(req, res, next) {
  const token = req.cookies["jwt"];
  if (!token) return res.sendStatus(403);
  //check if token is in blacklist
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    err && console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
