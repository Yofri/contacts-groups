const app = require('express')();  // immediately invoke express function
const bodyParser = require('body-parser');
const ejs = require('ejs');
const model = require('./model/model');
const {getHome, getContacts, postContacts} = require('./controller/controller');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', './view');
app.set('view engine', 'ejs');

app.get('/', getHome);
app.get('/contacts', getContacts);
app.post('/contacts', postContacts);

app.listen('3000', () => {
  console.log(`App has started`);
});