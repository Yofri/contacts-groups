const express    = require('express')
const bodyParser = require('body-parser')
const sqlite3    = require('sqlite3').verbose()

const db         = new sqlite3.Database('data/database.db')
const app        = express()

//set to load css
app.use(express.static(__dirname + '/views'))
// set the view engine to ejs
app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// *** ROUTES

//* START INDEX *//
app.get('/',(req,res)=>{
  res.render('index')
})

//* START CONTACTS *//
//CREATE
app.post('/contacts',(req,res)=>{
  db.run(`insert into Contacts(name,company,telp_number,email) VALUES (
    '${req.body.name}','${req.body.company}','${req.body.telp_number}','${req.body.email}'
  )`)
  res.redirect('contacts')
  console.log(req.body)
})

//READ
app.get('/contacts',(req,res)=>{
  db.all('select * from Contacts',(err,data)=>{
    if(!err){
      res.render('contacts',{data_Contacts:data})
    }else{
      res.send(err)
      console.log('error load db Contacts');
    }
  })
})
//UPDATE
app.get('/contacts/edit/:id',(req,res)=>{
  db.all(`select * from Contacts where id=${req.params.id}`,(err,data)=>{
    if(!err){
      res.render('contacts-edit',{data_Contacts:data[0]})
      // console.log(data);
    }
  })
})

app.post('/contacts/edit/:id',(req,res)=>{
  db.all(`update Contacts set name = "${req.body.name}", company = "${req.body.company}", telp_number = "${req.body.telp_number}", email = "${req.body.email}" where id = "${req.params.id}"`,(err)=>{
    res.redirect('../../contacts')
  })
})
//DELETE
app.get('/contacts/delete/:id',(req,res)=>{
  db.all(`delete from Contacts where id=${req.params.id}`,(err)=>{
    res.redirect('../../contacts')
  })
})

//* END CONTACTS *//
//* START GROUPS *//
//CREATE
app.post('/groups',(req,res)=>{
  db.run(`insert into Groups(name_of_group) values ('${req.body.name_of_group}')`,(err)=>{
    if(!err){
      res.redirect('groups')
    }
  })
})
//READ
app.get('/groups',(req,res)=>{
  db.all(`select * from Groups`,(err,data)=>{
    if(!err){
      res.render('groups',{data_Groups:data})
    }
  })
})
//UPDATE
app.get('/groups/edit/:id',(req,res)=>{
  db.all(`select * from Groups where id='${req.params.id}'`,(err,data)=>{
    res.render('groups-edit',{data_Groups:data[0]})
  })
})
app.post('/groups/edit/:id',(req,res)=>{
  db.run(`update Groups set name_of_group = '${req.body.name_of_group}' where id = '${req.params.id}'`,(err)=>{
    res.redirect('../../groups')
  })
})
//DELETE
app.get('/groups/delete/:id',(req,res)=>{
  db.run(`delete from Groups where id='${req.params.id}'`,(err)=>{
    res.redirect('../../groups')
  })
})





app.listen(3000,(err)=>{
  if(!err){console.log(`running your serv in port:3000`);}
})
