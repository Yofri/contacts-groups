const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser')

const app = express()
const db = new sqlite3.Database('database.db')

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.render('index')
})


app.get('/contacts', (req, res) => {
  db.all(`SELECT * FROM Contacts`, (err, contacts) => {
    db.all(`SELECT Groups.name_of_group, ContactsGroups.ContactId, ContactsGroups.GroupId FROM ContactsGroups LEFT JOIN Groups ON ContactsGroups.GroupId = Groups.id`, (err, groups) => {
      db.all(`SELECT * FROM Groups`, (err, groupsname) => {
        for(var i = 0; i < contacts.length; i++) {
          var tampung = []
          groups.forEach((elemen) => {
            if(contacts[i].id == elemen.ContactId) {
              tampung.push(elemen.name_of_group)
            }
          })
          contacts[i].group = tampung.join(',')
        }
        // res.send(groupsname)
        res.render('contacts', {data: contacts, groupsname: groupsname, error:''})
      })
    })
  })
})

app.post('/contacts', (req, res) => {
  if(req.body.name == "") {
    db.all(`SELECT * FROM Contacts`, (err, contacts) => {
      db.all(`SELECT Groups.name_of_group, ContactsGroups.ContactId, ContactsGroups.GroupId FROM ContactsGroups LEFT JOIN Groups ON ContactsGroups.GroupId = Groups.id`, (err, groups) => {
        db.all(`SELECT * FROM Groups`, (err, groupsname) => {
          for(var i = 0; i < contacts.length; i++) {
            var tampung = []
            groups.forEach((elemen) => {
              if(contacts[i].id == elemen.ContactId) {
                tampung.push(elemen.name_of_group)
              }
            })
            contacts[i].group = tampung.join(',')
          }
          // res.send(groupsname)
          res.render('contacts', {data: contacts, groupsname: groupsname, error: "name tidak boleh kosong"})
        })
      })
    })
  }
  else {
    db.all(`INSERT INTO Contacts (name, company, telp_number, email) VALUES ('${req.body.name}', '${req.body.company}', '${req.body.telp_number}', '${req.body.email}')`, (err) => {
      db.all(`SELECT Contacts.id FROM Contacts ORDER BY id DESC LIMIT 1`, (err, contact) => {
        db.all(`INSERT INTO ContactsGroups (ContactId, GroupId) VALUES ("${contact[0].id}", "${req.body.groupid}")`)
        // res.send(req.body)
        res.redirect('/contacts')
      })
    })
  }
})


app.get('/contacts/delete/:id', (req, res) => {
  db.all(`DELETE FROM Contacts WHERE id = "${req.params.id}"`)
  res.redirect('/contacts')
})

app.get('/contacts/edit/:id', (req, res) => {
  db.all(`SELECT * FROM Contacts WHERE id = "${req.params.id}"`, (err, contactsbyid) => {
    res.render('contactsedit', {data: contactsbyid})
  })
})

app.post('/contacts/edit/:id', (req, res) => {
  db.all(`UPDATE Contacts SET name = "${req.body.name}", company = "${req.body.company}", telp_number = "${req.body.telp_number}", email = "${req.body.email}" WHERE id = "${req.params.id}"`)
  res.redirect('/contacts')
})

app.get('/contacts/addresses/:id', (req, res) => {
  db.all(`SELECT * FROM Contacts WHERE id = "${req.params.id}"`, (err, contact) => {
    db.all(`SELECT * FROM Addresses WHERE ContactId = ${req.params.id}`, (err, addresses) => {
      res.render('contactaddress', {contact: contact, addresses: addresses})
    })
  })
})

app.post('/contacts/addresses/:id', (req, res) => {
  db.all(`INSERT INTO Addresses (street, city, zipcode, ContactId) VALUES ('${req.body.street}', '${req.body.city}', '${req.body.zipcode}', '${req.params.id}')`)
  res.redirect('/contacts')
})


app.get('/groups', (req, res) => {
  db.all(`SELECT * FROM Groups`, (err, groups) => {
    db.all(`SELECT ContactsGroups.ContactId, Contacts.name, ContactsGroups.GroupId FROM ContactsGroups LEFT JOIN Contacts ON ContactsGroups.ContactId = Contacts.id`, (err, contact) => {
      for(var i = 0; i < groups.length; i++) {
        var tampung = []
        contact.forEach((elemen) => {
          if(groups[i].id == elemen.GroupId) {
            tampung.push(elemen.name)
          }
        })
        groups[i].groups = tampung.join(',')
      }
      res.render('groups', {data: groups})
    })
  })
})


app.post('/groups', (req, res) => {
  db.all(`INSERT INTO Groups (name_of_group) VALUES ('${req.body.name_of_group}')`)
  res.redirect('/groups')
})

app.get('/groups/edit/:id', (req, res) => {
  db.all(`SELECT * FROM Groups WHERE id = "${req.params.id}"`, (err, groupsedit) => {
    res.render('groupsedit', {data:groupsedit})
  })
})

app.post('/groups/edit/:id', (req, res) => {
  db.all(`UPDATE Groups SET name_of_group = "${req.body.name_of_group}" WHERE id = "${req.params.id}"`)
  res.redirect('/groups')
})

app.get('/groups/delete/:id', (req, res) => {
  db.all(`DELETE FROM Groups WHERE id = "${req.params.id}"`)
  res.redirect('/groups')
})

app.get('/groups/assign_contacts/:id', (req, res) => {
  db.all(`SELECT * FROM Contacts`, (err, contact) => {
    db.all(`SELECT * FROM Groups WHERE id = '${req.params.id}'`, (err, group) => {
      res.render('groupassigned', {contact: contact, group: group})
    })
  })
})

app.post('/groups/assign_contacts/:id', (req, res) => {
  db.all(`INSERT INTO ContactsGroups (ContactId, GroupId) VALUES ("${req.body.ContactId}", "${req.params.id}")`)
  res.redirect('/groups')
})

app.get('/profiles', (req, res) => {
  db.all(`SELECT Profile.id, Profile.username, Profile.password, Profile.contactId, Contacts.name FROM Profile LEFT JOIN Contacts ON Profile.contactId = Contacts.id ORDER BY Profile.contactId`, (err, profiles) => {
    db.all(`SELECT Contacts.id, Contacts.name FROM Contacts`, (err, contactname) => {
      res.render('profile', {data:profiles, error: '', contactname: contactname})
    })
  })
})

app.post('/profiles', (req, res) => {

  db.all(`INSERT INTO Profile (username, password, contactId) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.contactId}')`, (err) => {
    console.log(req.body);
    if(err) {
      db.all(`SELECT Profile.id, Profile.username, Profile.password, Profile.contactId, Contacts.name FROM Profile LEFT JOIN Contacts ON Profile.contactId = Contacts.id ORDER BY Profile.contactId`, (err, profiles) => {
        // console.log('error');
        db.all(`SELECT Contacts.id, Contacts.name FROM Contacts`, (err, contactname) => {
          console.log(req.body);
          res.render('profile', {data:profiles, error: 'Your contact already have profile', contactname: contactname})
        })
      })
    }
    else {
      res.redirect('profiles')
    }
  })


})

app.get('/profiles/delete/:id', (req, res) => {
  db.all(`DELETE FROM Profile WHERE id = "${req.params.id}"`)
  res.redirect('/profiles')
})

app.get('/profiles/edit/:id', (req, res)=> {
  db.all(`SELECT Profile.id, Profile.username, Profile.password, Profile.contactId, Contacts.name FROM Profile LEFT JOIN Contacts ON Profile.contactId = Contacts.id WHERE Profile.id = "${req.params.id}"`, (err, profiles) => {
    db.all(`SELECT Contacts.id, Contacts.name FROM Contacts`, (err, contactname) => {
      res.render('profileedit', {data: profiles, error: '', contactname: contactname})

    })
  })
})

app.post('/profiles/edit/:id', (req, res) => {
  db.all(`UPDATE Profile SET username = "${req.body.username}", password = "${req.body.password}", contactId = "${req.body.contactId}" WHERE id = "${req.params.id}"`)
  res.redirect('/profiles')
})

app.get('/addresses', (req, res) => {
  db.all(`SELECT Addresses.id, Addresses.street, Addresses.city, Addresses.zipcode, Addresses.ContactId, Contacts.name FROM Addresses LEFT JOIN Contacts ON Addresses.ContactId = Contacts.id ORDER BY Addresses.contactId`, (err, addresses) => {
    db.all(`SELECT Contacts.id, Contacts.name FROM Contacts`, (err, contact) => {
      res.render('addresses', {data: addresses, contact: contact})
    })
    // res.send(addresses)
  })
})

app.post('/addresses', (req, res) => {
  db.all(`INSERT INTO Addresses (street, city, zipcode, ContactId) VALUES ('${req.body.street}', '${req.body.city}', '${req.body.zipcode}', '${req.body.ContactId}')`)
  res.redirect('/addresses')
})

app.get('/addresses/delete/:id', (req, res) => {
  db.all(`DELETE FROM Addresses WHERE id = "${req.params.id}"`)
  res.redirect('/addresses')
})

app.get('/addresses/edit/:id', (req, res) => {
  db.all(`SELECT Addresses.id, Addresses.street, Addresses.city, Addresses.zipcode, Addresses.ContactId, Contacts.name FROM Addresses LEFT JOIN Contacts ON Addresses.ContactId = Contacts.id WHERE Addresses.id = "${req.params.id}"`, (err, addresses) => {
    db.all(`SELECT Contacts.id, Contacts.name FROM Contacts`, (err, contact) => {
      res.render('addressesedit', {data: addresses, contact: contact})
    })

  })
})

app.post('/addresses/edit/:id', (req, res) => {
  db.all(`UPDATE Addresses SET street = "${req.body.street}", city = "${req.body.city}", zipcode = "${req.body.zipcode}", ContactId = "${req.body.ContactId}" WHERE id = "${req.params.id}"`, (err) => {
    console.log(err)
    console.log(req.body);
  })
  res.redirect('/addresses')
})

app.get('/lastcontact', (req, res) => {
  db.all(`SELECT * FROM ContactsGroups`, (err, contact) => {
    res.send(contact)
  })
})

app.listen(3000, function () {
  console.log('app listening on port 3000!')
})
