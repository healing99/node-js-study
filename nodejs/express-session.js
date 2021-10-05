const express = require("express");
const parseurl = require("parseurl");
const session = require("express-session");
const secret = require("../secret");

const app = express();

//app.use() : 요청이 있을때마다 해당 미들웨어가 실행된다
app.use(
  session({
    // 세션 동작 옵션
    secret: secret.secretId,
    resave: false,
    saveUninitialized: true
  })
);

app.get("/", function (req, res, next) {
  console.log(req.session);
  if (req.session.num === undefined) {
    req.session.num = 1;
  } else {
    req.session.num += 1;
  }
  res.send(`Views : ${req.session.num}`);
});

app.listen(3000, function () {
  console.log("3000!!");
});

/* 
세션 관리용 미들웨어인 express-session은 req 객체에 session이라는 프로퍼티를 만들어준다(req.session)
Session {
  cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }
}
*/
