const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

function templateHTML(title, list, body) {
  return `
  <!DOCTYPE html>
        <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8" />
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <a href="/create">create</a>
            ${body}
          </body>
        </html>
  `;
}

function templateList(fileList) {
  let list = "<ul>";
  let i = 0;
  while (i < fileList.length) {
    list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
    i = i + 1;
  }
  list = list + "</ul>";
  return list;
}
//웹 서버 객체를 만들때 createServer 를 이용
//createServer로 전달된 콜백함수는 두개의 인자 (request, response)
//request: 클라이언트가 요청할 때 (주소창에 친 행위도 서버에 정보를 요청한 것에 해당함)
//response: 클라이언트로 돌려줄 응답
//request -> 서버 처리 -> response 흐름!!
let app = http.createServer((request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query; // parse : _url에 대한 정보가 객체로 담긴다
  const pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (error, fileList) => {
        const title = "Welcome";
        data = "Hello, Node.js";

        const list = templateList(fileList);

        const template = templateHTML(title, list, `<h2>${title}</h2>${data}`);

        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", (error, fileList) => {
        fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
          const title = queryData.id;
          const list = templateList(fileList);
          const template = templateHTML(
            title,
            list,
            `<h2>${title}</h2>${data}`
          );

          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", (error, fileList) => {
      const title = "WEB - create";
      const list = templateList(fileList);

      const template = templateHTML(
        title,
        list,
        `
      <form action="http://localhost:3000/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="description" placeholder="description"></textarea></p>
      <p><input type="submit" /></p>
      </form>
      `
      );

      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    let body = "";
    request.on("data", (data) => {
      //request에 data가 있을 경우 처리하는 부분
      body = body + data;
    });
    request.on("end", () => {
      //request에 data 처리가 다 끝났음을 알려주는 부분
      const post = qs.parse(body); //parse : 객체화
      const title = post.title;
      const description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", (err) => {
        //파일 저장이 끝난 다음 실행될 코드
        response.writeHead(200);
        response.end("success");
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000); //서버가 사용하고자 하는 포트 번호

/*

 */
