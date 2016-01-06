function a(val) {
    this.p = val;
}

function b(val) {
    this.a = new a(val);
}
