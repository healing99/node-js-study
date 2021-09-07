const mysql = require("mysql");

//mysql의 아이디, 비밀번호 입력할 것
const connection = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: "web_practice"
});

connection.connect();

connection.query("SELECT * FROM topic", (error, results, fields) => {
  if (error) {
    console.log(error);
  }
  console.log(results);
});

connection.end();
