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

knex.schema.hasTable("users").then((exists) => {
  if (!exists) {
    return knex.schema.createTable("users", (t) => {
      t.uuid("id").primary().notNullable();
      t.string("email").notNullable();
      t.string("password").notNullable();
    });
  }
});
