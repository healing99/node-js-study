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
      db.query(`SELECT * FROM topic`, (error, topics) => {
        console.log(topics);
        const title = "Welcome";
        description = "Hello, Node.js";
        const list = template.list(topics);
        const html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      db.query("SELECT * FROM topic", (error, topics) => {
        if (error) {
          throw error;
        }
        //해당하는 id의 정보 가져오기
        db.query(
          `SELECT * FROM topic WHERE id=?`,
          [queryData.id],
          (error2, topic) => {
            if (error2) {
              throw error2;
            }
            const title = topic[0].title;
            description = topic[0].description;
            const list = template.list(topics);
            const html = template.HTML(
              title,
              list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>
             <a href="/update?id=${queryData.id}">update</a>
             <form action="delete_process" method="post">
             <input type="hidden" name="id" value="${queryData.id}">
             <input type="submit" value="delete">
             </form>
              `
            );
            response.writeHead(200);
            response.end(html);
          }
        );
      });
    }
  } else if (pathname === "/create") {
    db.query(`SELECT * FROM topic`, (error, topics) => {
      const title = "Create";
      const list = template.list(topics);
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

      db.query(
        `INSERT INTO topic (title, description, created, author_id) VALUES(?, ?,  NOW(), ?);`,
        [post.title, post.description, 1],
        (error, result) => {
          if (error) throw error;
          response.writeHead(302, { Location: `/?id=${result.insertId}` }); //getting the id of an inserted row 방법
          response.end();
        }
      );
    });
  } else if (pathname === "/update") {
    db.query("SELECT * FROM topic", (error, topics) => {
      if (error) throw error;
      db.query(
        "SELECT * FROM topic WHERE id=?",
        [queryData.id],
        (error2, topic) => {
          if (error2) throw error2;
          const list = template.list(topics);
          const html = template.HTML(
            topic[0].title,
            list,
            `
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${topic[0].id}">
          <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"/></p>
          <p><textarea name="description" placeholder="description">${topic[0].description}</textarea></p>
          <p><input type="submit" /></p>
          </form>
          `,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );

          response.writeHead(200);
          response.end(html);
        }
      );
    });
  } else if (pathname === "/update_process") {
    let body = "";
    request.on("data", (data) => {
      body = body + data;
    });
    request.on("end", () => {
      const post = qs.parse(body);
      db.query(
        "UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?",
        [post.title, post.description, post.id],
        (error, result) => {
          if (error) throw error;
          response.writeHead(302, { Location: `/?id=${post.id}` }); //status code 302 : 주어진 URL에 일시적으로 이동되었음을 가리킴
          response.end();
        }
      );
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

/*
[ Node.js + MySQL ]

<<SQL injection 예방하기>>
db.query('SELECT * FROM topic WHERE id=?',[queryData.id], function(err, data)
-> 이와 같이 query 메서드를 사용할때 2번째 인자로 입력데이터(queryData.id)를 주고
1번째 인자의 해당 부분을 `?` 변수로 치환하면된다

*/
