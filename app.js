const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const ContactsModel = require('./models/contacts-model');
const GroupsModel = require('./models/groups-model');
const ProfilesModel = require('./models/profile-model');
const AddressesModel = require('./models/addresses-model');

// Model
let contact = new ContactsModel('./database/database.db');
let group = new GroupsModel('./database/database.db');
let profile = new ProfilesModel('./database/database.db');
let address = new AddressesModel('./database/database.db');

// Setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setup view
app.set('views', './views');
app.set('view engine', 'ejs');

// Website route
app.get('/', (req, res) => {
	res.render('index');
});

// Contacts
app.get('/contacts', (req, res) => {
	contact.getAllData(function(rows) {
		res.render('contacts', { data: rows });
	});
});

app.post('/contacts', (req, res) => {
	contact.addData(req.body);
	res.redirect('/contacts');
});

app.get('/contacts/edit/:id', (req, res) => {
	contact.getAllData(function(rows) {
		contact.getById({id: req.params.id}, (editedRows) =>{
			res.render('contacts', { id: req.params.id, data: rows, editItem: editedRows });
		});
	});	
});

app.post('/contacts/edit/:id', (req, res) => {
	contact.updateDataById({id: req.params.id, editItem: req.body});
	res.redirect('/contacts/');
});

app.get('/contacts/delete/:id', (req, res) => {
	contact.deleteDataById({id: req.params.id});
	res.redirect('/contacts/');
});

// Groups
app.get('/groups', (req, res) => {
	group.getAllData(function(rows) {
		res.render('groups', { data: rows });
	});
});

app.post('/groups', (req, res) => {
	group.addData(req.body);
	res.redirect('/groups');
});

app.get('/groups/edit/:id', (req, res) => {
	group.getAllData(function(rows) {
		group.getById({id: req.params.id}, (editedRows) =>{
			res.render('groups', { id: req.params.id, data: rows, editItem: editedRows });
		});
	});	
});

app.post('/groups/edit/:id', (req, res) => {
	group.updateDataById({id: req.params.id, editItem: req.body});
	res.redirect('/groups/');
});

app.get('/groups/delete/:id', (req, res) => {
	group.deleteDataById({id: req.params.id});
	res.redirect('/groups/');
});

// Profile
app.get('/profiles', (req, res) => {
	profile.getAllDataInnerJoin('Contacts', function(rows) {
		res.render('profile', { data: rows });
	});
});

app.post('/profiles', (req, res) => {
	profile.addData(req.body);
	res.redirect('/profiles');
});

app.get('/profiles/edit/:id', (req, res) => {
	profile.getAllDataInnerJoin('Contacts', function(rows) {
		profile.getById({id: req.params.id}, (editedRows) =>{
			res.render('profile', { id: req.params.id, data: rows, editItem: editedRows });
		});
	});	
});

app.post('/profiles/edit/:id', (req, res) => {
	profile.updateDataById({id: req.params.id, editItem: req.body});
	res.redirect('/profiles/');
});

app.get('/profiles/delete/:id', (req, res) => {
	profile.deleteDataById({id: req.params.id});
	res.redirect('/profiles/');
});

// Address
app.get('/addresses', (req, res) => {
	address.getAllData(function(rows) {
		res.render('addresses', { data: rows });
	});
});

app.post('/addresses', (req, res) => {
	address.addData(req.body);
	res.redirect('/addresses');
});

app.get('/addresses/edit/:id', (req, res) => {
	address.getAllData(function(rows) {
		address.getById({id: req.params.id}, (editedRows) =>{
			res.render('addresses', { id: req.params.id, data: rows, editItem: editedRows });
		});
	});	
});

app.post('/addresses/edit/:id', (req, res) => {
	address.updateDataById({id: req.params.id, editItem: req.body});
	res.redirect('/addresses/');
});

app.get('/addresses/delete/:id', (req, res) => {
	address.deleteDataById({id: req.params.id});
	res.redirect('/addresses/');
});

// Listening
app.listen(3001, () => {
	console.log('Listening port 3001');
});