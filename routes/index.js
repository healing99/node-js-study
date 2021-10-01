const express = require("express");
const router = express.Router();
const template = require("../lib/template");

router.get("/", (req, res) => {
  const title = "Welcome";
  const description = "Hello, Node.js";
  const list = template.list(req.list); //이제 req객체의 list프로퍼티를 통해서 글목록에 접근할 수 있게됨
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width: 300px; display: block; margin-top: 10px;">
    `,
    `<a href="/topic/create">create</a>`
  );
  res.send(html);
});

router.get("/login", (req, res) => {
  const title = "WEB - create";
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `
      <form action="/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
      </form>
    `,
    ""
  );
  res.send(html);
});

module.exports = router;
