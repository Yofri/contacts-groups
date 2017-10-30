const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');


class Addresses {

  static findAllAdresses(callback) {
    let query = `SELECT * FROM Addresses`
    db.all(query,function(err,rows){
      if(err){
        callback(err, null)
      }
      else{
        callback(null,rows)
      }
    })
  }
  static addressesCreate(Obj, callback){
    let query = (`INSERT INTO Addresses (street, city, zipcode) VALUES("${Obj.street}", "${Obj.city}", "${Obj.zipcode}")`)
    db.all(query, function(err,rows){
      if(err){
        callback(err, null)
      }
      else{
        callback(null,rows)
      }
    })
  }
  static addressesUpdate(Obj, callback){
    let query = (`SELECT * FROM Addresses where id = "${Obj.id}"`)
    db.all(query, function(err,rows){
      if(err){
        callback(err, null)
      }
      else{
        callback(null, rows)
      }
    })
  }
  static addressesUpdatePost(Obj, callback){
    let query = (`UPDATE Addresses SET street = "${Obj.street}", city = "${Obj.city}", zipcode = "${Obj.zipcode}" WHERE id = "${Obj.id}"`)
    db.all(query, function(err,rows){
      if(err){
        callback(err, null)
      }
      else{
        callback(null, rows)
      }
    })
  }
  static Remove(Obj,callback){
    let query = (`DELETE FROM Addresses WHERE id = "${Obj.id}"`)
    db.all(query, function(err,rows){
      if(err){
        callback(err,null)
      }
      else{
        callback(null, rows)
      }
    })
  }
  // db.all(`DELETE FROM Addresses WHERE id = "${id}"`);
  // res.redirect('/addresses')
}
module.exports = Addresses;
