const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const users = [
  { name: "Bryson", tableauAuth: 1 },
  { name: "notbryson", tableauAuth: 2 },
];
let refreshTokens = [];

app.get("/tableau", authenticateToken, (req, res) => {
  res.json(users.filter((user) => user.name === req.user.name));
});

app.post("/login", (req, res) => {
  const user = req.body;
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/token", (req, res) => {
  const requestToken = req.body.token;
  if (requestToken === null) return res.sendStatus(401);
  if (!refreshTokens.includes(requestToken)) return res.sendStatus(403);
  jwt.verify(requestToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json(accessToken);
  });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
