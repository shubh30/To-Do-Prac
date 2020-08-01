const express = require('express');
const bodyParser = require('body-parser');

const app = new express();

let listItems = ['Buy Food', 'Cook Food', 'Eat Food'];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

// Getting home page
app.get('/', function (req, res) {
  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  let today = new Date();
  today = today.toLocaleDateString('en-US', options);
  res.render('list', { date: today, todoListItems: listItems });
});

// post input data to home page
app.post('/', function (req, res) {
  let item = req.body.listItem;
  listItems.push(item);
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('Server is up and running');
});
