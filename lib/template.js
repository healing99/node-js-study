module.exports = {
  HTML: (title, list, body, control) => {
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
  },
  list: (fileList) => {
    let list = "<ul>";
    let i = 0;
    while (i < fileList.length) {
      list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
      i = i + 1;
    }
    list = list + "</ul>";
    return list;
  },
  authorSelect: (authors, author_id) => {
    let tag = "";
    let i = 0;
    while (i < authors.length) {
      let selected = "";
      if (authors[i].id === author_id) {
        selected = " selected";
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
    <select name="author">
    ${tag}
    </select>
    `;
  },
  authorTable: (authors) => {
    let tag = `<table>`;
    let i = 0;
    while (i < authors.length) {
      tag += `
      <tr>
      <td>${authors[i].name}</td>
      <td>${authors[i].profile}</td>
      <td><a href="/author/update?id=${authors[i].id}">update</a></td>
      <td> 
      <form action="/author/delete_process" method="post">
      <input type="hidden" name="id" value="${authors[i].id}">
      <input type="submit" value="delete">
      </form>
      </td>
      </tr>
      `;
      i++;
    }
    tag += `</table>`;
    return tag;
  }
};

/*
주의! DELETE는 <a href=""></a> 와 같이
링크로 표현하면 안된다! form으로 처리해주자
*/
