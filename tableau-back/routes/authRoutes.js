const { Router } = require("express");
const {
  signup_post,
  login_post,
  logout_del,
  token_post
} = require("../controllers/authController");

const router = Router();

router.post("/signup", signup_post);

router.post("/login", login_post);

router.delete("/logout", logout_del);

router.post('/token', token_post);

module.exports = router;
