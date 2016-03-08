// 00_routine.js
// subroutine 의 sync 
// couroutine 의 async 비교.

var log = console.log;


//========= SUBROUTINE TEST ==================
function my_subroutine_sync(M) {
  function print(v) { log('     sub> ' + v); }
  var shared;

//sub0: 
  print(' ');
  shared = 1;

//sub1:
  var v1 = M.get();
  print(v1);
  v1 += shared;
  M.return(v1);

//sub2: 
  var v2 = M.get();
  print(v2);
  v2 += shared;
  M.return(v2);

//end:
  return M;
}

function test_sub() {
  function print(v) { log('main> ' + v); }

  var M =  {
    return: function(v) { this.v = v; }, 
    get: function()     { return this.v + 1; },
  };

  M.v = 1;
  print(M.v);
  my_subroutine_sync(M);
  print(M.v);
}



//========= COROUTINE TEST ==================
function my_coroutine_async(v) {
  function print(v) { log('     sub> ' + v); }
//-----------------------------------------------------------------------------
  var shared;        //|   var shared;
                     //|
var _0 =             //| sub0:
function () {        //| 
  print(' ');        //|   print(' ');
  shared = 1;        //|   shared = 1;
  return v;          //|
}                    //|
var _1 =             //| sub1:  
function (v1) {      //|   var v1 = M.get();  
  print(v1);         //|   print(v1);
  v1 += shared;      //|   v1 += shared;
  return v1;         //|   M.return(v1);
}                    //|  
var _2 =             //| sub2:
function (v2) {      //|   var v2 = M.get(); 
  print(v2);         //|   print(v2);
  v2 += shared;      //|   v2 += shared;
  return v2;         //|   M.return(v2);
 }                   //| 
//end:               //| end:
 return [_0, _1, _2];//|   return M;
}

function test_co() {
  function print(v) { log('main> ' + v); }
  
  var v = 1;
  print(v);
  var co = my_coroutine_async(v);

  v = co[0](undefined);
  for (var i = 1; i < co.length; ++i) 
    v = co[i](get(v));

  print(v);

  function get(v) { return v + 1; }
}

//========= TEST RUN ==================
function test_run() {
  test_sub();
  console.log('------------');

  test_co();
  console.log('------------');
}


module.exports = {
  run: test_run
}