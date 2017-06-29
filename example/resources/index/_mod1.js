// 各个模块保持单一职责

console.log('_mod1.js');

function test1() {
    console.log('_mod1.js', 'test1');
}

function test2() {
    console.log('_mod1.js', 'test2');
}
function test3() {
    console.log('_mod1.js', 'test3');
}

export default test1;

export {
    test2,
    test3
}