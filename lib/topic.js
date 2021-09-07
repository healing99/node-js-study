const url = require("url");
const qs = require("querystring");
const db = require("./db");
const template = require("./template");

exports.home = (request, response) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
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
};

exports.page = (request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query; // parse : _url에 대한 정보가 객체로 담긴다

  db.query("SELECT * FROM topic", (error, topics) => {
    if (error) {
      throw error;
    }
    //해당하는 id의 정보 가져오기
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
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
          `<h2>${title}</h2>${description}
        <p>by ${topic[0].name}</p>
        `,
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
};

exports.create = (request, response) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
    db.query("SELECT * FROM author", (error2, authors) => {
      const title = "Create";
      const list = template.list(topics);
      const html = template.HTML(
        title,
        list,
        `
    <form action="/create_process" method="post">
    <p><input type="text" name="title" placeholder="title"/></p>
    <p><textarea name="description" placeholder="description"></textarea></p>
    <p>
    ${template.authorSelect(authors)}
    </p>
    <p><input type="submit" /></p>
    </form>
    `,
        ""
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
      `INSERT INTO topic (title, description, created, author_id) VALUES(?, ?,  NOW(), ?);`,
      [post.title, post.description, post.author],
      (error, result) => {
        if (error) throw error;
        response.writeHead(302, { Location: `/?id=${result.insertId}` }); //getting the id of an inserted row 방법
        response.end();
      }
    );
  });
};

exports.update = (request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query; // parse : _url에 대한 정보가 객체로 담긴다

  db.query("SELECT * FROM topic", (error, topics) => {
    if (error) throw error;
    db.query(
      "SELECT * FROM topic WHERE id=?",
      [queryData.id],
      (error2, topic) => {
        if (error2) throw error2;
        db.query("SELECT * FROM author", (error3, authors) => {
          const list = template.list(topics);
          const html = template.HTML(
            topic[0].title,
            list,
            `
        <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${topic[0].id}">
        <p><input type="text" name="title" placeholder="title" value="${
          topic[0].title
        }"/></p>
        <p><textarea name="description" placeholder="description">${
          topic[0].description
        }</textarea></p>
        <p>${template.authorSelect(authors, topic[0].author_id)}</p>
        <p><input type="submit" /></p>
        </form>
        `,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );

          response.writeHead(200);
          response.end(html);
        });
      }
    );
  });
};

exports.update_process = (request, response) => {
  let body = "";
  request.on("data", (data) => {
    body = body + data;
  });
  request.on("end", () => {
    const post = qs.parse(body);
    db.query(
      "UPDATE topic SET title=?, description=?, author_id=? WHERE id=?",
      [post.title, post.description, post.author, post.id],
      (error, result) => {
        if (error) throw error;
        response.writeHead(302, { Location: `/?id=${post.id}` }); //status code 302 : 주어진 URL에 일시적으로 이동되었음을 가리킴
        response.end();
      }
    );
  });
};

exports.delete_process = (request, response) => {
  let body = "";
  request.on("data", (data) => {
    body = body + data;
  });
  request.on("end", () => {
    const post = qs.parse(body);
    db.query("DELETE FROM topic WHERE id=?", [post.id], (error, result) => {
      if (error) throw error;
      response.writeHead(302, { Location: "/" });
      response.end();
    });
  });
};
