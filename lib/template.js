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
      list =
        list +
        `<li><a href="/?id=${fileList[i].id}">${fileList[i].title}</a></li>`;
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
  }
};
