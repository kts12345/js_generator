// 01_iterator.js
// iterator 프로토콜 테스트.
// from https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Iteration_protocols

var log = console.log;


//========= BUILT_IN ITERATOR TEST ==================
function test_built_in_iterator() {
  var ary = [1, 2, 3];
  var it = ary[Symbol.iterator]();

  log(it.next()); // { value: 1, done: false }
  log(it.next()); // { value: 2, done: false }
  log(it.next()); // { value: 3, done: false }
  log(it.next()); // { value: undefined, done: true }
  log(it.next()); // { value: undefined, done: true }
}

//========= HAND_MADE ITERATOR TEST ==================
function test_hand_made_iterator() {
  var ary = [1, 2, 3];
  var it = my_hand_made_iter(ary);

  log(it.next()); // { value: 1, done: false }
  log(it.next()); // { value: 2, done: false }
  log(it.next()); // { value: 3, done: false }
  log(it.next()); // { value: undefined, done: true }
  log(it.next()); // { value: undefined, done: true }
}

function my_hand_made_iter(ary) {
  var i = 0;
  function next() {
    return (i < ary.length) ? 
           { value: ary[i++],  done: false }:
           { value: undefined, done: true  };
  }
  return { next: next };
}

//========= ITERATOR LOOP TEST ==================
function test_iterator_loop() {
  var ary = [1, 2, 3];
  var it = my_hand_made_iter(ary);

  for (var r = it.next(); !r.done; r = it.next())
    log(r);       // { value: 1, done: false } 
                  // { value: 2, done: false }
                  // { value: 3, done: false }
  log(r);         // { value: undefined, done: true }
  log(it.next()); // { value: undefined, done: true }
}


//========= TEST RUN ==================
function test_run() {
  test_built_in_iterator();
  console.log('------------');

  test_hand_made_iterator();
  console.log('------------');

  test_iterator_loop();
  console.log('------------');
}


module.exports = {
  run: test_run
}