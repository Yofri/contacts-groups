const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Router
const indexRouter = require('./routers/index-routes');
const contactRouter = require('./routers/contact-routes');
const groupRouter = require('./routers/group-routes');

const ContactsModel = require('./models/contacts-model');
const GroupsModel = require('./models/groups-model');
const ProfilesModel = require('./models/profile-model');
const AddressesModel = require('./models/addresses-model');
const ContactsGroupsModel = require('./models/contacts-groups-model');

// Model
let contact = new ContactsModel('./database/database.db');
let group = new GroupsModel('./database/database.db');
let profile = new ProfilesModel('./database/database.db');
let address = new AddressesModel('./database/database.db');
let contactGroup = new ContactsGroupsModel();

// Setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setup view
app.set('views', './views');
app.set('view engine', 'ejs');

// Website route
app.use('/', indexRouter);
app.use('/contacts', contactRouter);
app.use('/groups', groupRouter);

// Groups


// Profile
app.get('/profiles', (req, res) => {
	profile.getAllDataInnerJoin('Contacts', function(rows) {
		
		contact.getAllData((allcontacts) => {
			res.render('profile', { data: rows, contacts: allcontacts });
		});
		
	});
});

app.post('/profiles', (req, res) => {
	profile.addData(req.body);
	res.redirect('/profiles');
});

app.get('/profiles/edit/:id', (req, res) => {
	profile.getAllDataInnerJoin('Contacts', function(rows) {
		contact.getAllData((allcontacts) => {
			profile.getById({id: req.params.id}, (editedRows) =>{
				res.render('profile', { id: req.params.id, data: rows, editItem: editedRows, contacts: allcontacts});
			});
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
	address.getAllDataInnerJoin('Contacts', function(rows) {

		contact.getAllData((allcontacts) => {
			res.render('addresses', { data: rows, contacts: allcontacts });
		});
	});
});

app.post('/addresses', (req, res) => {
	address.addData(req.body);
	res.redirect('/addresses');
});

app.get('/addresses/edit/:id', (req, res) => {
	address.getAllDataInnerJoin('Contacts', function(rows) {
		contact.getAllData((allcontacts) => {
			address.getById({id: req.params.id}, (editedRows) =>{
				res.render('addresses', { id: req.params.id, data: rows, editItem: editedRows, contacts: allcontacts});
			});
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

app.get('/addresses_with_contact', (req, res) => {
	address.getAllData(function(rows) {

		contact.getAllData((allcontacts) => {
			res.render('addresses-contact', { data: rows, contacts: allcontacts, joinedData: contact.getAllDataArrayJoin(rows, allcontacts)});
		});
	});
});

// Listening
app.listen(3001, () => {
	console.log('Listening port 3001');
});