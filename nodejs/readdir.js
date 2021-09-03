let testFolder = "./data";
let fs = require("fs");

fs.readdir(testFolder, (error, fileList) => {
  console.log(fileList); // 특정 디렉토리에 있는 파일의 목록을 배열 형태로 반환
});
