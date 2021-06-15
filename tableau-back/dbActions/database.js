require("dotenv").config();
const { v4: uuidv4, v4 } = require("uuid");
const bcrypt = require("bcrypt");
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
});

async function saveNewUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  user.id = v4();
  try {
    await knex("users").insert(user);
    return user;
  } catch (e) {
    console.log(e);
  }
}

async function getUser(email) {
  try {
    const user = await knex("users").where({ email: email }).first();
    return user;
  } catch (e) {
    console.log(e);
  }
}

async function checkPassword({ password, email }) {
  const user = await getUser(email);
  if(!user) return null
  try {
    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  } catch (e) {
    return e;
  }
}

module.exports = { saveNewUser, getUser, checkPassword };
