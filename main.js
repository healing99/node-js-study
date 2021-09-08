const http = require("http");
const url = require("url");
const topic = require("./lib/topic");
const author = require("./lib/author");

//웹 서버 객체를 만들때 createServer 를 이용
//createServer로 전달된 콜백함수는 두개의 인자 (request, response)
//request: 클라이언트가 요청할 때 (주소창에 친 행위도 서버에 정보를 요청한 것에 해당함)
//response: 클라이언트로 돌려줄 응답
//request -> 서버 처리 -> response 흐름!!
let app = http.createServer((request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query; // parse : _url에 대한 정보가 객체로 담긴다
  const pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      topic.home(request, response);
    } else {
      topic.page(request, response);
    }
  } else if (pathname === "/create") {
    topic.create(request, response);
  } else if (pathname === "/create_process") {
    topic.create_process(request, response);
  } else if (pathname === "/update") {
    topic.update(request, response);
  } else if (pathname === "/update_process") {
    topic.update_process(request, response);
  } else if (pathname === "/delete_process") {
    topic.delete_process(request, response);
  } else if (pathname === "/author") {
    author.home(request, response);
  } else if (pathname === "/author/create_process") {
    author.create_process(request, response);
  } else if (pathname === "/author/update") {
    author.update(request, response);
  } else if (pathname === "/author/update_process") {
    author.update_process(request, response);
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000); //서버가 사용하고자 하는 포트 번호

/*
<<글 수정>>

<input type="hidden" name="id" value="${title}"> 코드에 대해서:
id는 수정할 파일의 (이전) 이름을 갖고 있기 위해서 (화면에는 보이지 않도록 type="hidden" 적용)

-----

<<글 삭제>>
delete는 링크로 구현하면 안된다!!
form 태그 사용
method는 반드시 "post"

-----

<<입력정보에 대한 보안>>
path 모듈은 파일, 폴더, 디렉토리 등의 경로를 편리하게 설정할 수 있는 기능 제공

"안전하게" 경로를 설정하기 위해서 path 모듈의 메소드 사용하자

[예시]
path.parse('../password.js');  
{ root: '',
 dir: '..',
 base: 'password.js',
 ext: '.js',
 name: 'password' } // 리턴 값

 -----

<<출력정보에 대한 보안>>

입력 본문에 <script>와 같이 예민한 태그 등이 포함되어 있으면
보안적인 문제 위험이 있다
-> sanitize-html 모듈을 사용해보자
*/

/*
[ Node.js + MySQL ]

<<SQL injection 예방하기>>
db.query('SELECT * FROM topic WHERE id=?',[queryData.id], function(err, data)
-> 이와 같이 query 메서드를 사용할때 2번째 인자로 입력데이터(queryData.id)를 주고
1번째 인자의 해당 부분을 `?` 변수로 치환하면된다

*/
