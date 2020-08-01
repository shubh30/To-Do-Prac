const express = require('express');
const bodyParser = require('body-parser');

const app = new express();

app.set('view engine', 'ejs');

// 
app.get('/', function (req, res) {
  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  let today = new Date();
  today = today.toLocaleDateString('en-US', options);
  res.render('list', {date: today});
});

app.listen(3000, function () {
  console.log('Server is up and running');
});
