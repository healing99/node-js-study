let http = require("http");
let fs = require("fs");

//웹 서버 객체를 만들때 createServer 를 이용
let app = http.createServer((request, response) => {
  let url = request.url;
  if (url == "/") {
    url = "/index.html";
  }
  if (url == "/favicon.ico") {
    return response.writeHead(404);
  }
  response.writeHead(200);
  response.end(fs.readFileSync(__dirname + url));
});
app.listen(3000); //서버가 사용하고자 하는 포트 번호
