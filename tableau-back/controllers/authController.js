const {
  saveNewUser,
  getUser,
  checkPassword,
} = require("../dbActions/database");
const jwt = require("jsonwebtoken");

const jwtExpirationInSeconds = 5 * 60;

module.exports.signup_post = async (req, res) => {
  const user = await saveNewUser(req.body);
  res.send(user);
};

module.exports.login_post = async (req, res) => {
  const user = req.body;
  let userID;
  try {
    userID = await checkPassword(user);
    if (userID === null) return res.sendStatus(404);
    userID = userID.id;
  } catch (err) {
    console.log(err);
    res.send("something went wrong");
  }
  const accessToken = generateAccessToken({ userID });
  res.cookie("jwt", accessToken, {
    maxAge: jwtExpirationInSeconds * 1000,
    httpOnly: true,
  });
  res.json({ userID });
};

module.exports.logout_del = (req, res) => {
  //do some sort of logout
  //can't deauthenticate jwt tokens
  //I can create a blacklist, a db table of all jwt tokens
  //that were logged out before expiration
  //if I do that though, should I routinely go into the db and delete ones that are expired anyway?
  //I also should send a new cookie with expiration 0
  res.cookie("jwt", "", { maxAge: 0 });
  res.sendStatus(204);
};

module.exports.token_post = (req, res) => {
  const requestToken = req.cookie["jwt"];
  if (requestToken === null || requestToken == undefined)
    return res.sendStatus(401);
  jwt.verify(requestToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ userID: user.id });
    res.cookie("jwt", accessToken, {
      maxAge: jwtExpirationInSeconds,
      httpOnly: true,
    });
    res.sendStatus(400);
  });
};

function generateAccessToken(userID) {
  return jwt.sign(userID, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: jwtExpirationInSeconds,
  });
}
