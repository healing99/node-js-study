const http = require("http");
const cookie = require("cookie");

http
  .createServer((request, response) => {
    let cookies = {};
    //쿠키가 존재할때(쿠키 읽기)
    if (request.headers.cookie !== undefined) {
      cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies);

    //쿠키 생성
    response.writeHead(200, {
      "Set-Cookie": [
        "yummy_cookie=choco",
        "tasty_cookie=strawberry",
        `Permanent=cookies; Max-Age=${60 * 60 * 24 * 30}`,
        "Secure=Secure; Secure",
        "HttpOnly=HttpOnly; HttpOnly"
      ]
    });
    response.end("Cookie");
  })
  .listen(3000);
