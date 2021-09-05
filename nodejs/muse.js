/*
module(모듈): 특정한 기능을 하는 함수나 변수들의 집합
여러 프로그램에 해당 모듈을 재사용할 수 있음
*/
let M = {
  v: "v",
  f: function () {
    console.log(this.v);
  }
};

const part = require("./mpart.js");
console.log(part);
part.f();
