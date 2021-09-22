const express = require("express");
const app = express();
const fs = require("fs");
const template = require("./lib/template");
const bodyParser = require("body-parser");
const compression = require("compression"); //압축된 방식으로 데이터 사용할 수 있음
const topicRouter = require("./routes/topic");

app.use(express.static("public")); //public 디렉토리안에서 정적파일을 찾겠다
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get("*", (req, res, next) => {
  //get방식으로 들어오는 모든 요청에 대해서만 수행
  fs.readdir("./data", (error, fileList) => {
    req.list = fileList; //req객체의 list변수에 fileList값을 줌
    next(); //next()를 호출해야 다음 미들웨어로 넘어갈 수 있음
  });
});

//라우팅
app.get("/", (req, res) => {
  const title = "Welcome";
  const description = "Hello, Node.js";
  const list = template.list(req.list); //이제 req객체의 list프로퍼티를 통해서 글목록에 접근할 수 있게됨
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width: 300px; display: block; margin-top: 10px;">
    `,
    `<a href="/topic/create">create</a>`
  );
  res.send(html);
});

app.use("/topic", topicRouter); // "/topic"으로 시작하는 주소에 topicRouter라는 이름의 미들웨어를 적용하겠다

//더 이상 실행할 미들웨어x 경우
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find the page");
});

//4가지 인자를 가짐 - 에러 핸들링을 위한 미들웨어
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something Wrong");
});

app.listen(3000, () => console.log("Example app listening on port 3000"));

/*
라우팅
app.METHOD(PATH, HANDLER)
- app은 express의 인스턴스
- METHOD는 HTTP 요청 메소드 (get, post, put, delete)
- PATH는 서버에서의 경로
- HANDLER는 라우터가 일치할때 실행되는 함수

------------------------------------

res.send([body])
클라이언트에 응답 데이터를 보낸다. 전달할 수 있는 데이터에는
HTML 문자열, Buffer 객체, JSON 객체, JSON 배열 등이 있다

------------------------------------

app.get("/", (req, res) => {});
이와 같이 두번째 인자로 전달된 콜백도 결국 모두 미들웨어라고 할 수 있다.
미들웨어는 순차적으로 처리된다.

*/
