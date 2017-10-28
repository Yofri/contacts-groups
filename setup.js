var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');

db.serialize(()=>{
  
  //set query!!
  let contacts = `CREATE TABLE IF NOT EXISTS Contacts (
                  id          INTEGER     PRIMARY KEY,
                  name        VARCHAR(50) NOT NULL,
                  company     VARCHAR(50),
                  telp_number VARCHAR(20),
                  email       VARCHAR(30)
                  )`;
                  
  let groups   = `CREATE TABLE IF NOT EXISTS Groups (
                  id            INTEGER     PRIMARY KEY,
                  name_of_group VARCHAR(50)
                  )`;
  
  let profile  = `CREATE TABLE IF NOT EXISTS Profile (
                  id       INTEGER     PRIMARY KEY,
                  username VARCHAR(50) NOT NULL UNIQUE,
                  password VARCHAR(50) NOT NULL
                  )`;
                  
  let addresses = `CREATE TABLE IF NOT EXISTS Addresses (
                  id      INTEGER      PRIMARY KEY,
                  street  VARCHAR(50),
                  city    VARCHAR(50),
                  zipcode INTEGER
                  )`;
                  
  //create table!!!              
  db.run(contacts, ()=>{console.log('table Contacts added');});                  
  db.run(groups, ()=>{console.log('table Groups added');});                  
  db.run(profile, ()=>{console.log('table Profile added');});                   
  db.run(addresses, ()=>{console.log('table Addresses added');}); 
  
  
  //release 3
  //tambah coloumn di profile untuk foreign key id_contacts
  let foreignProfile = `ALTER TABLE Profile
                          ADD id_contacts INT
                          CONSTRAINT id_contacts
                          REFERENCES Contacts (id)`;
  
  db.run(foreignProfile, (err)=>{
    console.log('coloumn id_contacts added to Profile');
  
  
  }); 
  
  //set unique Profile          
  let renameProfile = `ALTER TABLE Profile RENAME TO old_table;`
  let crNewProfile = `
                      CREATE TABLE Profile
                      (
                        id       INTEGER     PRIMARY KEY,
                        username VARCHAR(50) NOT NULL UNIQUE,
                        password VARCHAR(50) NOT NULL,
                        id_contacts INT  UNIQUE
                        CONSTRAINT id_contacts REFERENCES Contacts (id)
                      );`
  let delOldTableProfile = `DROP TABLE old_table`
  db.run(renameProfile);
  db.run(crNewProfile);
  db.run(delOldTableProfile, ()=>{console.log('Profile updated');});
       
})

db.close();