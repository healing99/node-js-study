const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

function templateHTML(title, list, body, control) {
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
            ${control}
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

        const template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${data}`,
          `<a href="/create">create</a>`
        );

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
            `<h2>${title}</h2>${data}`,
            `<a href="/create">create</a> 
             <a href="/update?id=${title}">update</a>
             <form action="delete_process" method="post">
             <input type="hidden" name="id" value="${title}">
             <input type="submit" value="delete">
             </form>
             `
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
      <form action="/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="description" placeholder="description"></textarea></p>
      <p><input type="submit" /></p>
      </form>
      `,
        ""
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
        response.writeHead(302, { Location: `/?id=${title}` }); //status code 302 : 주어진 URL에 일시적으로 이동되었음을 가리킴
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", (error, fileList) => {
      fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
        const title = queryData.id;
        const list = templateList(fileList);
        const template = templateHTML(
          title,
          list,
          ` 
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"/></p>
          <p><textarea name="description" placeholder="description">${data}</textarea></p>
          <p><input type="submit" /></p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );

        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathname === "/update_process") {
    let body = "";
    request.on("data", (data) => {
      body = body + data;
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const id = post.id;
      const title = post.title;
      const description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, (error) => {
        // 기존 파일의 이름 수정하기
        fs.writeFile(`data/${title}`, description, "utf8", (err) => {
          // 본문 description 내용 수정
          response.writeHead(302, { Location: `/?id=${title}` }); //status code 302 : 주어진 URL에 일시적으로 이동되었음을 가리킴
          response.end();
        });
      });
      console.log(post);
    });
  } else if (pathname === "/delete_process") {
    let body = "";
    request.on("data", (data) => {
      body = body + data;
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const id = post.id;
      fs.unlink(`data/${id}`, (error) => {
        response.writeHead(302, { Location: "/" });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000); //서버가 사용하고자 하는 포트 번호

/*
<<글 수정>>

<input type="hidden" name="id" value="${title}"> 코드에 대해서:
id는 수정할 파일의 (이전) 이름을 갖고 있기 위해서 (화면에는 보이지 않도록 type="hidden" 적용)

<<글 삭제>>
delete는 링크로 구현하면 안된다!!
form 태그 사용
method는 반드시 "post"
*/
