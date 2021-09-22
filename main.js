const express = require("express");
const app = express();
const fs = require("fs");
const template = require("./lib/template.js");

//라우팅
app.get("/", (req, res) => {
  fs.readdir("./data", (error, fileList) => {
    const title = "Welcome";
    const description = "Hello, Node.js";
    const list = template.list(fileList);
    const html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    res.send(html);
  });
});

app.get("/page/:pageId", (req, res) => {
  res.send(req.params);
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
*/
