var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var convertToObjectId = require('mongodb').ObjectID;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'contact';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Kết nối thành công");

//   const db = client.db(dbName);

//   client.close();
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/them', function(req, res, next) {
  res.render('them', { title: 'Thêm mới dữ liệu' });
});

router.post('/them', function(req, res, next) {

  var duLieu01 = {
    "ten": req.body.ten,
    "dt": req.body.dt
  }

  const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Insert some documents
    collection.insert(duLieu01
      , function(err, result) {
      assert.equal(err, null);
      console.log("Thêm dữ liệu thành công");
      callback(result);
    });
  }

  // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Kết nối dữ liệu thành công");

      const db = client.db(dbName);

      insertDocuments(db, function() {
        client.close();
      });
    });

  res.redirect('/them');


});

// Xem
router.get('/xem', function(req, res, next) {
  const findDocuments = function(db, callback) {
    const collection = db.collection('nguoidung');

    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    findDocuments(db, function(duLieu){
      res.render('xem', { title: 'Xem dữ liệu', data: duLieu });
      console.log(duLieu);
      client.close();
    });
  });
  
});

router.get('/xoa/:idcanxoa', function(req, res, next) {
  var idcanxoa = req.params.idcanxoa;
  
  const xoaContact = function(db, callback) {
    const collection = db.collection('nguoidung');
    collection.deleteOne({ _id : convertToObjectId(idcanxoa) }, function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      callback(result);
      
    });
  }

  //Kết nối Mongo
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    xoaContact(db, function() {
      client.close();
      res.redirect('/xem');
    });
  });
});

/* Sửa dữ liệu. */
router.get('/sua', function(req, res, next) {
  //res.render('index', { title: 'Express' });
});

module.exports = router;