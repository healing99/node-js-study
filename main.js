let http = require("http");
let fs = require("fs");
let url = require("url");

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
let app = http.createServer((request, response) => {
  let _url = request.url;
  let queryData = url.parse(_url, true).query; // parse : _url에 대한 정보가 객체로 담긴다
  let pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (error, fileList) => {
        let title = "Welcome";
        data = "Hello, Node.js";

        let list = templateList(fileList);

        let template = templateHTML(title, list, `<h2>${title}</h2>${data}`);

        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", (error, fileList) => {
        fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
          let title = queryData.id;
          let list = templateList(fileList);
          let template = templateHTML(title, list, `<h2>${title}</h2>${data}`);

          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", (error, fileList) => {
      let title = "WEB - create";
      let list = templateList(fileList);

      let template = templateHTML(
        title,
        list,
        `
      <form action="http://localhost:3000/process_create" method="post">
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="description" placeholder="description"></textarea></p>
      <p><input type="submit" /></p>
      </form>
      `
      );

      response.writeHead(200);
      response.end(template);
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000); //서버가 사용하고자 하는 포트 번호
