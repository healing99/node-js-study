const mysql = require("mysql");
const db_config = require("../config.json");

const db = mysql.createConnection({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database
});
db.connect();

module.exports = db;
