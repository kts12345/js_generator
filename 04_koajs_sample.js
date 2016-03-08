// 04_koajs_sample.js
// koajs http api 서버 프레임웤 예제.


// 1초 후에 v 값을 가지는 Promise 를 생성
function d(v) {
  function timer(cb) {
    setTimeout(function () {
      cb(v);
    }, 1000);
  }
  return new Promise(timer);
};

function* abc_gen() {
  function print(v) { console.log('        abc_gen: ' + v); }
  var s;

  s = yield d('a');
  print(s);
  s = yield d('b');
  print(s);
  
  return 'abc';
  
  s = yield d('c');
  print(s);
}

function* even_gen(s) {
  function print(v) { console.log('    even_gen: ' + v); }

  s = yield d(s);
  print(s);
  
  var str = yield abc_gen();
  print(str);
  
  s = yield d(s + 2);
  print(s);
  
  s = yield d(s + 1);
  return d(d(d(d(d(d(s))))));
}


function* odd_gen(s) {
  function print(v) { console.log('odd_gen: ' + v); }
  
  try {
    s = yield d(s);
    print(s);
    
    s = yield d(d(d(d(d(d(s + 2))))));
    print(s);
    
    s = yield even_gen(s + 1);
    print(s);
    
    s = yield d(s + 2);
    print(s);
    
    s = yield d(s + 2);
    print(s);
    
    return d(s);
  }
  catch (e) {
    print(e);
    throw e;
  }
}

function* handler() {
  console.log('start ----------');
  this.body = 'hello koa.  result: ';
  this.body += yield odd_gen(3);
  console.log('end ------------');
}

var app = require('koa')();
app.use(handler);


//========= TEST RUN ==================
function test_run() {

  app.listen(31000, function () {
    console.log('server started\n');
  });

  //-----------------------------
  require('request')('http://127.0.0.1:31000/', function (err, res, body) {
    console.log('');
    console.log('-------------------');
    console.log('client response');
    console.log('    STATUS: ' + res.statusCode);
    console.log('    BODY: ' + body);
    console.log('-------------------');
  });
}

module.exports = {
  run: test_run
}
