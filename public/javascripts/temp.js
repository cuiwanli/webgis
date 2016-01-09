

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

{
    "_id": ObjectID("5680ad56a2225c8597c5d1ab"),
    "name": "line 3",
    "path": [
        [
            146.589645,
            14.756579,
            3000
        ],
        [
            147.644638,
            14.35182,
            3000
        ]
    ],
    "img": "/lib/line3/prew/Line3.PNG",
    "data": "/lib/line3/data/data3.grd"
}