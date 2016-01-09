mm = function() {
    m = {
        a: a,
        b: a
    };

    function a() {
        console.log('a');
    }

    function b() {
        console.log('b');
    }
    return m;
}();
mm.a();
console.log(mm);
