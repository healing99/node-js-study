const url = require("url");
const qs = require("querystring");
const db = require("./db");
const template = require("./template");

exports.home = (request, response) => {
  db.query("SELECT * FROM topic", (error, topics) => {
    db.query("SELECT * FROM author", (error2, authors) => {
      const title = "author";
      const list = template.list(topics);
      const html = template.HTML(
        title,
        list,
        `
        ${template.authorTable(authors)}
        <style>
          table {
            border-collapse: collapse;
          }
          td {
            border: 1px solid black;
          }
        </style>
        <form action="/author/create_process" method="post">
        <p>
            <input type="text" name="name" placeholder="name">
        </p>
        <p>
            <textarea name="profile" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
        </form>
        `,
        `<a href="/create">create</a> `
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = (request, response) => {
  let body = "";
  request.on("data", (data) => {
    //request에 data가 있을 경우 처리하는 부분
    body = body + data;
  });
  request.on("end", () => {
    //request에 data 처리가 다 끝났음을 알려주는 부분
    const post = qs.parse(body); //parse : 객체화

    db.query(
      `INSERT INTO author (name, profile) VALUES(?, ?);`,
      [post.name, post.profile],
      (error, result) => {
        if (error) throw error;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

exports.update = (request, response) => {
  db.query("SELECT * FROM topic", (error, topics) => {
    db.query("SELECT * FROM author", (error2, authors) => {
      const _url = request.url;
      const queryData = url.parse(_url, true).query;
      db.query(
        `SELECT * FROM author WHERE id=?`,
        [queryData.id],
        (error3, author) => {
          const title = "author";
          const list = template.list(topics);
          const html = template.HTML(
            title,
            list,
            `
        ${template.authorTable(authors)}
        <style>
          table {
            border-collapse: collapse;
          }
          td {
            border: 1px solid black;
          }
        </style>
        <form action="/author/update_process" method="post">
        <p>
        <input type="hidden" name="id" value="${queryData.id}">
        </p>
        <p>
            <input type="text" name="name" value="${author[0].name}">
        </p>
        <p>
            <textarea name="profile">${author[0].profile}</textarea>
        </p>
        <p>
            <input type="submit">
        </p>
        </form>
        `,
            `<a href="/create">create</a> `
          );
          response.writeHead(200);
          response.end(html);
        }
      );
    });
  });
};

exports.update_process = (request, response) => {
  let body = "";
  request.on("data", (data) => {
    //request에 data가 있을 경우 처리하는 부분
    body = body + data;
  });
  request.on("end", () => {
    //request에 data 처리가 다 끝났음을 알려주는 부분
    const post = qs.parse(body); //parse : 객체화

    db.query(
      `UPDATE author SET name=?, profile=? WHERE id=?`,
      [post.name, post.profile, post.id],
      (error, result) => {
        if (error) throw error;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};
