

function d() {
    console.log('d');
    b();
    c();
}

function b() {
	function c(){
		console.log('c');
	}
    console.log('b');
}
function a(val) {
    this.p = val;
}
b();
d();