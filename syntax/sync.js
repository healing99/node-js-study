const fs = require("fs");

/*
//readFileSync (동기)
console.log("A");
const result = fs.readFileSync("syntax/sample.txt", "utf8");
console.log(result);
console.log("C");

//결과 : A B C
*/

//readFile (비동기)
console.log("A");
const result = fs.readFile("syntax/sample.txt", "utf8", (err, result) => {
  console.log(result); //콜백함수
});
console.log("C");

//결과 : A C B
