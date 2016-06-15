var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs-extra');
var mongoDb = require('mongodb');
Promise.promisifyAll(mongoDb);
var MongoClient = mongoDb.MongoClient;
var ObjectID = require('mongodb').ObjectID;
//mongorestore -h ds061464.mongolab.com:61464 -d zyoldb2 -u zhouzoro -p mydb1acc C:\zhouy\_wrkin\mongoDB-11-24\test
//mongorestore -d test -u zhouzoro -p mydb1acc C:\zhouy\_wrkin\mongoDB-11-24\test
//
//var url = process.env.MONGOLAB_URL || 'mongodb://mariana:MarianaDB2@ds061464.mongolab.com:61464/zyoldb2';
var url = process.env.MONGO_URl || 'mongodb://127.0.0.1:65123/gis';
//var url = ['mongodb://mariana:MarianaDB1@ds035485.mongolab.com:35485/zyoldb1', 'mongodb://mariana:MarianaDB2@ds061464.mongolab.com:61464/zyoldb2', 'mongodb://mariana:MarianaDB3@ds056698.mongolab.com:56698/zyoldb3'];
//heroku config:set MONGOLAB_URL=mongodb://mariana:MarianaDB1@ds035485.mongolab.com:35485/zyoldb1
var coll_name = 'graphics'; //mongodb collection name

var formidable = require('formidable'); //formidable to handle form upload
var util = require('util');

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

    var form = new formidable.IncomingForm({
        uploadDir: './public/images'
    });
    form.on('field', function(name, value) {
        res.send(value);
    });
    form.on('file', function(name, file) {
        var tempPath = file.path;
        var newPath = './public/images/' + file.name;
        fs.rename(tempPath, newPath);
        res.json({
            location: '/images/' + file.name
        });
    });

    form.parse(req);
});
router.get('/ck', function(req, res, next) {
    res.render('ck');
});
router.post('/ck', function(req, res, next) {

    var form = new formidable.IncomingForm();
    form.on('field', function(name, value) {
        res.send(value);
    });
    form.on('file', function(name, file) {
        var tempPath = file.path;
        var newPath = '/images/' + file.name;
        fs.rename(tempPath, newPath);
        res.json({
            location: newPath
        });
    });

    form.parse(req);
});

MongoClient.connectAsync(url).then(function(db) {
    console.log('mongoDB connected!');
    var graphics = db.collection(coll_name);
    graphics.find().count(function(err, count) {
        if (!count) generateGraphics()
    })

    function generateGraphics() {
        //insert layers
        var layers = [{
            id: 'L000',
            name: 'random-layer0'
        }, {
            id: 'L002',
            name: 'random-layer2'
        }, {
            id: 'L001',
            name: 'random-layer1'
        }]
        var gnum = _.range(1000);
        var lonRange = 35;
        var lonMin = 125;
        var latRange = 18;
        var latMin = 8;
        var verRange = 11000;
        var verMin = 0;
        _.forEach(layers, function(layer, index) {
            console.log('layer-' + layer.id + ' start generating:');
            var newGs = [];
            _.forEach(gnum, function(val, index) {
                var newPath = [];
                var pathLength = 2 + Math.floor(Math.random() * 2);
                for (var i = 0; i < pathLength; i++) {
                    newPath.push([
                        lonMin + Math.random() * lonRange,
                        latMin + Math.random() * latRange,
                        verMin + Math.random() * verRange
                    ]);
                }
                var newG = {
                    id: layer.id + 'G' + val,
                    layerId: layer.id,
                    name: layer.id + 'generated' + val,
                    path: newPath,
                    img: '/lib/line3/prew/Line3.PNG'
                }
                newGs.push(newG);
                console.log('layer-' + layer.id + val);
            })
            graphics.insertManyAsync(newGs).then(function(r) {
                console.log('layer-' + layer.id + 'insert sucessfull!');
                //console.log(r);
            }).catch(function(err) {
                console.log('ERROR:layer-' + layer.id + 'insert failed!');
                console.log(err);
            })
        })
    }
    router.get('/graphics?', function(req, res, next) {
        graphics.findAsync({
            layerId: req.query.layerId
        }).then(function(cursor) {
            return cursor.toArrayAsync()
        }).then(function(docs) {
            docs = _.slice(docs, req.query.chunkIndex * 30, req.query.chunkIndex * 30 + 30);
            console.log(docs.length + '----docs send!!!');
            res.send(docs);
        }).catch(function(err) {
            res.send(err);
            console.log(err);
        });
    });
})
module.exports = router;
