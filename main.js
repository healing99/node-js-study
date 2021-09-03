let http = require("http");
let fs = require("fs");
let url = require("url");

//웹 서버 객체를 만들때 createServer 를 이용
let app = http.createServer((request, response) => {
  let _url = request.url;
  let queryData = url.parse(_url, true).query; // parse : _url에 대한 정보가 객체로 담긴다
  let pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (error, fileList) => {
        console.log(fileList);
        let title = "Welcome";
        data = "Hello, Node.js";

        let list = "<ul>";
        let i = 0;
        while (i < fileList.length) {
          list =
            list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
          i = i + 1;
        }
        list = list + "</ul>";

        let template = `
          <!DOCTYPE html>
        <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8" />
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>
            ${data}
            </p>
          </body>
        </html>
          `;

        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", (error, fileList) => {
        console.log(fileList);
        let title = "Welcome";
        data = "Hello, Node.js";

        let list = "<ul>";
        let i = 0;
        while (i < fileList.length) {
          list =
            list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
          i = i + 1;
        }
        list = list + "</ul>";

        fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
          let title = queryData.id;
          let template = `
        <!DOCTYPE html>
      <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8" />
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>
          ${data}
          </p>
        </body>
      </html>
        `;

          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000); //서버가 사용하고자 하는 포트 번호
