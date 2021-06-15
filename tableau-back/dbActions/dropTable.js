require("dotenv").config();
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
});

knex.schema.hasTable("users").then(function (exists) {
  if (exists) {
    return knex.schema.dropTable("users");
  }
});