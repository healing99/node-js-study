const express = require("express");
const router = express.Router();
const template = require("../lib/template");

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

// router.post("/login_process", (req, res) => {
//   const post = req.body;
//   const email = post.email;
//   const password = post.password;
//   if (email === "test@gmail.com" && password === "1234") {
//     res.writeHead(302, {
//       "Set-Cookie": [`email=${email}`, `password=${password}`, `nickname=ysys`],
//       Location: "/"
//     });
//     res.end();
//   } else {
//     res.end("Wrong Account");
//   }
// });

module.exports = router;
