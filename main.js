const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const template = require("./lib/template.js");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const db_config = require("./config.json");

const mysql = require("mysql");
const db = mysql.createConnection({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database
});

db.connect();

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
      // fs.readdir("./data", (error, fileList) => {
      //   const title = "Welcome";
      //   data = "Hello, Node.js";

      //   const list = template.list(fileList);

      //   const html = template.HTML(
      //     title,
      //     list,
      //     `<h2>${title}</h2>${data}`,
      //     `<a href="/create">create</a>`
      //   );

      //   response.writeHead(200);
      //   response.end(html);
      db.query(`SELECT * FROM topic`, (error, topics) => {
        console.log(topics);
        response.writeHead(200);
        response.end("SUCCESS");
      });
    } else {
      fs.readdir("./data", (error, fileList) => {
        const filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, "utf8", (err, data) => {
          const title = queryData.id;
          const sanitizedTitle = sanitizeHtml(title);
          const sanitizedDescription = sanitizeHtml(data);
          const list = template.list(fileList);
          const html = template.HTML(
            sanitizedTitle,
            list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">create</a> 
             <a href="/update?id=${sanitizedTitle}">update</a>
             <form action="delete_process" method="post">
             <input type="hidden" name="id" value="${sanitizedTitle}">
             <input type="submit" value="delete">
             </form>
             `
          );

          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", (error, fileList) => {
      const title = "WEB - create";
      const list = template.list(fileList);

      const html = template.HTML(
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
      response.end(html);
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
    const filteredId = path.parse(queryData.id).base;
    fs.readdir("./data", (error, fileList) => {
      fs.readFile(`data/${filteredId}`, "utf8", (err, data) => {
        const title = queryData.id;
        const list = template.list(fileList);
        const html = template.HTML(
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
        response.end(html);
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
      const filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, (error) => {
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

-----

<<글 삭제>>
delete는 링크로 구현하면 안된다!!
form 태그 사용
method는 반드시 "post"

-----

<<입력정보에 대한 보안>>
path 모듈은 파일, 폴더, 디렉토리 등의 경로를 편리하게 설정할 수 있는 기능 제공

"안전하게" 경로를 설정하기 위해서 path 모듈의 메소드 사용하자

[예시]
path.parse('../password.js');  
{ root: '',
 dir: '..',
 base: 'password.js',
 ext: '.js',
 name: 'password' } // 리턴 값

 -----

<<출력정보에 대한 보안>>

입력 본문에 <script>와 같이 예민한 태그 등이 포함되어 있으면
보안적인 문제 위험이 있다
-> sanitize-html 모듈을 사용해보자
*/
