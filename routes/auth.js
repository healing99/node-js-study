const express = require("express");
const router = express.Router();
const template = require("../lib/template");

const authData = {
  email: "test@gmail.com",
  password: "1234",
  nickname: "nickname"
};

router.get("/login", (req, res) => {
  const title = "WEB - create";
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit" value="login"></p>
      </form>
    `,
    ""
  );
  res.send(html);
});

router.post("/login_process", (req, res) => {
  const post = req.body;
  const email = post.email;
  const password = post.password;
  if (email === authData.email && password === authData.password) {
    res.send("Welcome");
  } else {
    res.send("Wrong Account");
  }
});

module.exports = router;
