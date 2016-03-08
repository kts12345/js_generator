// 03_iterator_yield.js
// yield/return,  if/else control flow,  indentation 을 통한 자동화 코드 변환에 대한 직관. 

var log = console.log;

//=========  YIELD/RETURN && IF/ELSE  && INDENTATION ===============
function my_coroutine_async(v) {
  function print(v) { log('     sub> ' + v); }
  var shared;                                               return [
                                                            function() {
   print(' ');        
   shared = 1;                                                      
                                                            return ( 
        ['yield', v]                                        ); }, function 
   (v1)                                                     { 

   print(v1);         
   v1 += shared;                                                    
                                                            return (
        ['yield', v1]                                       ); }, function 
   (v2)                                                     {      

   print(v2);         
   v2 += shared;   

   if (v2 > 10)                                             {return( 
      ['return', v2]                                        );}
   else                                                     return(
      ['yield', v2]                                         );}, function 
   (v3)                                                     {

   print(v3);         
   v3 += shared;                                            return(
   ['return', v3]                                           );}
                                                            ];
}

//========= COROUTINE ITERATOR TEST  ===============
function test_co_iter() {
  function print(v) { log('main> ' + v); }
  
  v = 1;
  print(v);
  it = to_my_get_iter(my_coroutine_async(v));

  for (p = it.next(); !p.done; p = it.next(v)) {
    v = p.value;
  }

  print(v);
}

// converter
function to_my_get_iter(ary) {
  var i = 0;
  function next(v) {
    v = ary[i](v);
    return (i++ < ary.length) ? 
           { value: v[1],        done: v[0] === 'return'}:
           { value: undefined,   done: true  };
  }
  return { next: next };
}

//========= TEST RUN ==================
function test_run() {

  test_co_iter();
  console.log('------------');
}


module.exports = {
  run: test_run
}