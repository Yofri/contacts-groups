const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/data.db');

db.serialize(function(){
  db.run("CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(20), company TEXT, telp_number varchar(20), email varchar(50) )");
  db.run(`INSERT INTO Contacts (name,company,telp_number,email)
          VALUES("Ferdy","hacktiv8","0812345678","ferdy@gmail.com")`)
  db.run("CREATE TABLE IF NOT EXISTS Groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_group varchar(20) )");
  db.run("CREATE TABLE IF NOT EXISTS Profile (id INTEGER UNIQUE, username varchar(20), password vachar(20))");
  db.run("CREATE TABLE IF NOT EXISTS Addresses (id INTEGER UNIQUE, street varchar(30), city varchar(10), zipcode INTEGER)");
})

db.close()
