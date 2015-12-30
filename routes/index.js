var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var mongoDb = require('mongodb');
Promise.promisifyAll(mongoDb);
var MongoClient = mongoDb.MongoClient;
var ObjectID = require('mongodb').ObjectID;
//mongorestore -h ds061464.mongolab.com:61464 -d zyoldb2 -u zhouzoro -p mydb1acc C:\zhouy\_wrkin\mongoDB-11-24\test
//mongorestore -d test -u zhouzoro -p mydb1acc C:\zhouy\_wrkin\mongoDB-11-24\test
//
//var url = process.env.MONGOLAB_URL || 'mongodb://mariana:MarianaDB2@ds061464.mongolab.com:61464/zyoldb2';
var url = process.env.MONGO_URl || 'mongodb://127.0.0.1:37127/test';
//var url = ['mongodb://mariana:MarianaDB1@ds035485.mongolab.com:35485/zyoldb1', 'mongodb://mariana:MarianaDB2@ds061464.mongolab.com:61464/zyoldb2', 'mongodb://mariana:MarianaDB3@ds056698.mongolab.com:56698/zyoldb3'];
//heroku config:set MONGOLAB_URL=mongodb://mariana:MarianaDB1@ds035485.mongolab.com:35485/zyoldb1
var coll_name = 'graphics'; //mongodb collection name

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'View'
    });
});
router.get('/tinymce', function(req, res, next) {
    res.render('tinymce');
});
router.post('/tinymce', function(req, res, next) {
    console.log(req);
});

MongoClient.connectAsync(url).then(function(db) {
    console.log('mongoDB connected!');
    var graphics = db.collection(coll_name);
    router.get('/graphics', function(req, res, next) {
        graphics.findAsync().then(function(cursor) {
            return cursor.toArrayAsync()
        }).then(function(docs) {
            res.send(docs);
        }).catch(function(err) {
            res.send(err);
            console.log(err);
        });
    });
})
module.exports = router;
