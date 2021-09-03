let fs = require("fs");

fs.readFile("sample.txt", "utf8", (err, data) => {
  console.log(data);
});

//nodejs 폴더로 이동하여 $node fileRead.js 실행
