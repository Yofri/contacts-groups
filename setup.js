const sqlite3 = require('sqlite3').verbose()
const db      = new sqlite3.Database('data/database.db')

//* create table + validasi
function createTable(){
  db.run(`create table if not exists Contacts(
    id integer primary key,
    name text,
    company text,
    telp_number text,
    email text
  )`,(err)=>{
    if(err){console.log(err,'create Contacts');}
  })
  db.run(`create table if not exists Groups(
    id integer primary key,
    name_of_group text
  )`,(err)=>{
    if(err){console.log(err,'create Groups');}
  })
  db.run(`create table if not exists Profile(
    id integer primary key,
    username text,
    password text
  )`,(err)=>{
    if(err){console.log(err,'create Profile');}
  })
  db.run(`create table if not exists Addresses(
    id integer primary key,
    street text,
    city text,
    zipcode integer
  )`,(err)=>{
    if(err){console.log(err,'create Addresses');}
  })
  console.log('>>> success create all table <<<');
}

createTable()
