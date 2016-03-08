// 05_toward_await.js
// koa 처럼 generator/Promise 를 이용해서 await 시뮬레이션 하기 start 

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


function process_rng(rng, action, prev_val, last_action) {
  it = rng.next(prev_val);
  if (it.done === true) {
    if (last_action)
      last_action(it.value);
    return;
  }
  
  function cont(v) {
    action(v);
    prev_val = v;
    process_rng(rng, action, prev_val, last_action)
  };
  
  if (it.value[Symbol.iterator] !== undefined) {
    function local_last_action(val) {
      if (!val.then) {
        it = rng.next(val);
        it.value.then(cont);
      }
      else {
        val.then(function (val) {
          it = rng.next(val);
          it.value.then(cont);
        });
      }
    }
   // console.log("---------------recursive yield");
    process_rng(it.value, action, undefined, local_last_action);
  }
  else
    it.value.then(cont);
}



//========= TEST RUN ==================
function test_run() {
  var rng = odd_gen(3);
  process_rng(rng, function(){});
}

module.exports = {
  run: test_run
}
