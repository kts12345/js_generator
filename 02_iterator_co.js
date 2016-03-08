// 02_iterator_co.js
// iterator 프로토콜을 이용한 코루틴 작성.

var log = console.log;

function my_coroutine_async(v) {
  function print(v) { log('     sub> ' + v); }
//-----------------------------------------------------------------------------
  var shared;        //|   var shared;
return [             //|
                     //| sub0:
function () {        //| 
  print(' ');        //|   print(' ');
  shared = 1;        //|   shared = 1;
  return v;          //|
}                    //|
,                    //| sub1:  
function (v1) {      //|   var v1 = M.get();  
  print(v1);         //|   print(v1);
  v1 += shared;      //|   v1 += shared;
  return v1;         //|   M.return(v1);
}                    //|  
,                    //| sub2:
function (v2) {      //|   var v2 = M.get(); 
  print(v2);         //|   print(v2);
  v2 += shared;      //|   v2 += shared;
  return v2;         //|   M.return(v2);
 }                   //| 
//end:               //| end:
];                   //|   return M;
}

//========= COROUTINE NORMAL TEST  ===============
function test_co() {
  function print(v) { log('main> ' + v); }
  
  var v = 1;
  print(v);
  var co = my_coroutine_async(v);
  
  v = co[0](undefined);
  for (var i = 1; i < co.length; ++i)
    v = co[i](get(v));
  
  print(v);
  
  function get(v) { return v; }
}

//========= COROUTINE ITERATOR TEST  ===============
function test_co_iter() {
  function print(v) { log('main> ' + v); }
  
  v = 1;
  print(v);
  it = to_my_get_iter(my_coroutine_async(v));

  for (p = it.next(); !p.done; p = it.next(p.value)) 
    v = p.value;

  print(v);
}

// converter
function to_my_get_iter(ary) {
  return {
    i : 0,
    next: function (v) {
      return (this.i < ary.length) ? 
           { value: ary[this.i++](v), done: false }:
           { value: undefined, done: true };
    }
  };
}

//========= TEST RUN ==================
function test_run() {
  test_co();
  console.log('------------');

  test_co_iter();
  console.log('------------');
}


module.exports = {
  run: test_run
}