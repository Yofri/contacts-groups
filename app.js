const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.db');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');

//REQUIRE
// 1. Contacts
// 2. Groups
// 3. Profile
// 4. Addresses

// HOME
app.get('/', (req, res)=>{
  res.render('index')
})

// CONTACTS
app.get('/contacts', (req, res)=>{
  let query = `SELECT * FROM Contacts`
  db.all(query, (err, rows)=>{
    if(!err){
      res.render('contacts', {rowsContacts:rows})

    } else {
      res.send(err)
      console.log(err);
    }
  })
})

app.post('/contacts', (req, res)=>{
  let query = `INSERT INTO Contacts (name, company, telp_number, email) VALUES ('${req.body.name}','${req.body.company}','${req.body.telp_number}','${req.body.email}')`
  db.run(query)
  res.redirect('/contacts')
})

app.get('/contacts/edit/:id', (req, res)=>{
  let query = `SELECT * FROM Contacts WHERE id = '${req.params.id}'`
  db.get(query, (err, rows)=>{
    if(!err){
      res.render('editContacts', {dataContacts:rows})
    } else {
      res.send(err)
      console.log(err);
    }
  })
})

app.post('/contacts/edit/:id', (req, res)=>{
  let query = `UPDATE Contacts SET name = '${req.body.name}', company = '${req.body.company}', telp_number = '${req.body.telp_number}', email = '${req.body.email}' WHERE id = '${req.params.id}'`
  db.run(query)
  res.redirect('/contacts')
})

app.get('/contacts/delete/:id', (req, res)=>{
  let query = `DELETE FROM Contacts WHERE id = '${req.params.id}'`
  db.run(query)
  res.redirect('/contacts')
})

// GROUPS
app.get('/groups', (req, res)=>{
  let query = `SELECT * FROM Groups`
  db.all(query, (err, rows)=>{
    if(!err){
      res.render('groups', {rowsGroups:rows})
    } else {
      res.send(err)
      console.log(err);
    }
  })
})

app.post('/groups', (req, res)=>{
  let query = `INSERT INTO Groups (name_of_group) VALUES ('${req.body.name_of_group}')`
  db.run(query)
  res.redirect('/groups')
})

app.get('/groups/edit/:id', (req, res)=>{
  let query = `SELECT * FROM Groups WHERE id = '${req.params.id}'`
  db.get(query, (err, rows)=>{
    if(!err){
      res.render('editGroups', {dataGroups:rows})
    } else {
      res.send(err)
      console.log(err);
    }
  })
})

app.post('/groups/edit/:id', (req, res)=>{
  let query = `UPDATE Groups SET name_of_group = '${req.body.name_of_group}' WHERE id = '${req.params.id}'`
  db.run(query)
  res.redirect('/groups')
})

app.get('/groups/delete/:id', (req, res)=>{
  let query = `DELETE FROM Groups WHERE id = '${req.params.id}'`
  db.run(query)
  res.redirect('/groups')
})

// ADDRESSES
app.get('/addresses', (req, res)=>{
  let query = `SELECT * FROM Addresses`
  db.all(query, (err, rows)=>{
    if(!err){
      res.render('addresses', {rowsAddresses:rows})
    } else {
      res.send(err)
      console.log(err);
    }
  })
})

app.post('/addresses', (req, res)=>{
  let query = `INSERT INTO Addresses (street, city, zipcode) VALUES ('${req.body.street}','${req.body.city}','${req.body.zipcode}')`
  db.run(query)
  res.redirect('/addresses')
})

app.get('/addresses/edit/:id', (req, res)=>{
  let query = `SELECT * FROM Addresses WHERE id = '${req.params.id}'`
  db.get(query, (err, rows)=>{
    if(!err){
      res.render('editAddresses', {dataAddresses:rows})
    } else {
      res.send(err)
      console.log(err);
    }
  })
})

app.post('/addresses/edit/:id', (req, res)=>{
  let query = `UPDATE Addresses SET street = '${req.body.street}', city = '${req.body.city}',zipcode = '${req.body.zipcode}' WHERE id = '${req.params.id}'`
  db.run(query)
  res.redirect('/addresses')
})

app.get('/addresses/delete/:id', (req, res)=>{
  let query = `DELETE FROM Addresses WHERE id = '${req.params.id}'`
  db.run(query)
  res.redirect('/addresses')
})

// PROFILES
app.get('/profiles', (req, res)=>{
  let query = `SELECT * FROM Profile`
  db.all(query, (err, rows)=>{
    if(!err){
      res.render('profiles', {rowsProfiles:rows})
    } else {
      res.send(err)
      console.log(err);
    }
  })
})

app.post('/profiles', (req, res)=>{
  let query = `INSERT INTO Profile (username, password) VALUES ('${req.body.username}','${req.body.password}')`
  db.run(query, (err)=>{
    if(!err){
      res.redirect('/profiles')
    } else  {
      res.render('profiles')
    }
  })

})

app.get('/profiles/edit/:id', (req, res)=>{
  let query = `SELECT * FROM Profile WHERE id = '${req.params.id}'`
  db.get(query, (err, rows)=>{
    if(!err){
      res.render('editProfile', {dataProfiles:rows})
    } else {
      res.send(err)
      console.log(err);
    }
  })
})

app.post('/profiles/edit/:id', (req, res)=>{
  let query = `UPDATE Profile SET username = '${req.body.username}', password = '${req.body.password}' WHERE id = '${req.params.id}'`
  db.run(query)
  res.redirect('/profiles')
})

app.get('/profiles/delete/:id', (req, res)=>{
  let query = `DELETE FROM Profile WHERE id = '${req.params.id}'`
  db.run(query)
  res.redirect('/profiles')
})


//RUNNING APP SERVER
app.listen(3000,(err)=>{
  if(!err){
    console.log('Running ata 3000');
  } else {
    console.log(err);
  }

})
