const express = require("express");
const app = express();
const fs = require("fs");
const template = require("./lib/template");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const qs = require("querystring");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
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
  fs.readdir("./data", (error, filelist) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf8", (error, description) => {
      const title = req.params.pageId;
      const sanitizedTitle = sanitizeHtml(title);
      const sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ["h1"]
      });
      const list = template.list(filelist);
      const html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      res.send(html);
    });
  });
});

app.get("/create", (req, res) => {
  fs.readdir("./data", (error, filelist) => {
    const title = "WEB - create";
    const list = template.list(filelist);
    const html = template.HTML(
      title,
      list,
      `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `,
      ""
    );
    res.send(html);
  });
});

app.post("/create_process", (req, res) => {
  const post = req.body;
  const title = post.title;
  const description = post.description;
  fs.writeFile(`data/${title}`, description, "utf8", (err) => {
    res.writeHead(302, { Location: `/?id=${title}` });
    res.end();
  });
});

app.get("/update/:pageId", (req, res) => {
  fs.readdir("./data", (error, filelist) => {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf8", (err, description) => {
      const title = req.params.pageId;
      const list = template.list(filelist);
      const html = template.HTML(
        title,
        list,
        `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
      );
      res.send(html);
    });
  });
});

app.post("/update_process", (req, res) => {
  const post = req.body;
  const id = post.id;
  const title = post.title;
  const description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, (error) => {
    fs.writeFile(`data/${title}`, description, "utf8", (error) => {
      res.redirect(`/?id=${title}`);
      // res.writeHead(302, { Location: `/?id=${title}` });
      // res.end();
    });
  });
});

app.post("/delete_process", (req, res) => {
  const post = req.body;
  const id = post.id;
  const filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, (error) => {
    res.redirect("/");
  });
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
