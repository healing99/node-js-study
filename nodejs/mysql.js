const mysql = require("mysql");
const db_config = require("./config.json");

//createConnection 메서드는 MySQL서버와 상호작용하는 데 사용
const connection = mysql.createConnection({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database
});

connection.connect(); //서버와 실제 접속이 일어남

//query 메서드는 MySQL 데이터베이스에 대해 SQL 쿼리를 실행하는 데 사용
connection.query("SELECT * FROM topic", (error, results, fields) => {
  if (error) {
    console.log(error);
  }
  console.log(results);
});

connection.end();

//관련 참고사이트
//https://docs.microsoft.com/ko-kr/azure/mysql/connect-nodejs
