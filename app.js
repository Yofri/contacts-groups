const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/data.db');
const app = express();

app.set('views', './views')
app.set('view engine', 'ejs')
//load/init body parser and save to variable
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.get('/contacts',function(req,res){
  db.all(`SELECT * FROM Contacts`,function(err,rows){
    if(err){
      console.log(err)
    }else{
      //console.log(rows[0].name)
      res.render('contacts',{rows:rows, isEdit:false})

    }
  })
})
app.post('/contacts', urlencodedParser, function(req,res){
  console.log(req.body)
  let name = req.body.name
  let company = req.body.company
  let phoneNumber = req.body.phoneNumber
  let email = req.body.email
  db.all(`INSERT INTO Contacts (name,company,telp_number,email)
          VALUES("${name}", "${company}", "${phoneNumber}", "${email}")`)
    res.redirect('/contacts')
})

app.get('/contacts/edit/:id',function(req,res){
  //console.log(req.params.id)
  let isEdit = true;
  db.all(`SELECT * FROM Contacts where id = "${req.params.id}"`,function(err,rows){
    if(err){
      console.log(err)
    }else{
      console.log(rows[0].name)
      res.render('contacts',{rows:rows, isEdit:true})
    }
  })
})
app.post('/contacts/edit/:id', urlencodedParser, function(req,res){
  console.log(req.params.id)
  let id = req.params.id
  let name = req.body.name
  let company = req.body.company
  let phoneNumber = req.body.phoneNumber
  let email = req.body.email
  db.all(`UPDATE Contacts
          SET name = "${name}",
              company = "${company}",
              telp_number = "${phoneNumber}",
              email = "${email}"
              WHERE id = "${id}"`);
  res.redirect('/contacts')
})

app.get('/contacts/delete/:id', function(req,res){
  let id = req.params.id
  db.all(`DELETE FROM Contacts
          WHERE id = "${id}"`);
  res.redirect('/contacts')
})

//GROUP
app.get('/groups',function(req,res){
  db.all(`SELECT * FROM Groups`,function(err,rows){
    if(err){
      console.log(err)
    }else{
      res.render('groups',{rows:rows, isEdit:false})

    }
  })
})
//GROUPS ADD
app.post('/groups', urlencodedParser, function(req,res){
  let name = req.body.name
  db.all(`INSERT INTO Groups (name_of_group)
          VALUES("${name}")`)
    res.redirect('/groups')
})
//GROUPS DELETE
app.get('/groups/delete/:id', function(req,res){
  let id = req.params.id
  db.all(`DELETE FROM Groups
          WHERE id = "${id}"`);
  res.redirect('/groups')
})
//GROUPS EDIT
app.get('/groups/edit/:id',function(req,res){
  let isEdit = true;
  db.all(`SELECT * FROM Groups where id = "${req.params.id}"`,function(err,rows){
    if(err){
      console.log(err)
    }else{
      console.log(rows[0].name)
      res.render('groups',{rows:rows, isEdit:true})
    }
  })
})
app.post('/groups/edit/:id', urlencodedParser, function(req,res){
  let id = req.params.id
  let name = req.body.name
  db.all(`UPDATE Groups
          SET name_of_group = "${name}"
              WHERE id = "${id}"`);
  res.redirect('/groups')
})
//PROFILE
app.get('/profile',function(req,res){
  db.all(`SELECT * FROM Profile`,function(err,rows){
    if(err){
      console.log(err)
    }else{
      res.render('profile',{rows:rows, isEdit:false})

    }
  })
})
//PROFILE ADD
app.post('/profile', urlencodedParser, function(req,res){
  let username = req.body.username
  let password = req.body.password
  db.all(`INSERT INTO Profile (username, password)
          VALUES("${username}", "${password}")`)
    res.redirect('/profile')
})
//PROFILE DELETE
app.get('/profile/delete/:id', function(req,res){
  let id = req.params.id
  db.all(`DELETE FROM Profile
          WHERE id = "${id}"`);
  res.redirect('/profile')
})
//PROFILE EDIT
app.get('/profile/edit/:id',function(req,res){
  let isEdit = true;
  db.all(`SELECT * FROM Profile where id = "${req.params.id}"`,function(err,rows){
    if(err){
      console.log(err)
    }else{
      res.render('profile',{rows:rows, isEdit:true})
    }
  })
})
app.post('/profile/edit/:id', urlencodedParser, function(req,res){
  let id = req.params.id
  let username = req.body.username
  let password = req.body.password
  db.all(`UPDATE Profile
          SET username = "${username}",
              password = "${password}"
              WHERE id = "${id}"`);
  res.redirect('/profile')
})
//ADDRESSES
app.get('/addresses',function(req,res){
  db.all(`SELECT * FROM Addresses`,function(err,rows){
    if(err){
      console.log(err)
    }else{
      res.render('addresses',{rows:rows, isEdit:false})

    }
  })
})
//ADDRESSES ADD
app.post('/addresses', urlencodedParser, function(req,res){
  let street = req.body.street
  let city = req.body.city
  let zipcode = req.body.zipcode
  db.all(`INSERT INTO Addresses (street, city, zipcode)
          VALUES("${street}", "${city}", "${zipcode}")`)
    res.redirect('/addresses')
})
//ADDRESSES EDIT
app.get('/addresses/edit/:id',function(req,res){
  let isEdit = true;
  db.all(`SELECT * FROM Addresses where id = "${req.params.id}"`,function(err,rows){
    if(err){
      console.log(err)
    }else{
      res.render('addresses',{rows:rows, isEdit:true})
    }
  })
})
app.post('/addresses/edit/:id', urlencodedParser, function(req,res){
  let id = req.params.id
  let street = req.body.street
  let city = req.body.city
  let zipcode = req.body.zipcode
  db.all(`UPDATE Addresses
          SET street = "${street}",
              city = "${city}",
              zipcode = "${zipcode}"
              WHERE id = "${id}"`);
  res.redirect('/addresses')
})
//ADDRESSES DELETE
app.get('/addresses/delete/:id', function(req,res){
  let id = req.params.id
  db.all(`DELETE FROM Addresses
          WHERE id = "${id}"`);
  res.redirect('/addresses')
})
app.listen(3000,function(){
})
