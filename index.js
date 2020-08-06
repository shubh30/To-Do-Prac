const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistpracDB', {
  useNewUrlParser: true,
});

const itemSchema = {
  name: String,
};

const Item = mongoose.model('item', itemSchema);

const item1 = new Item({
  name: 'Welcome to your ToDo List',
});

const item2 = new Item({
  name: 'Hit the + button to add new Item',
});

const item3 = new Item({
  name: '<-- Hit this to delete item',
});

const defaultItem = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model('List', listSchema);

app.get('/', function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItem, function (err) {
        console.log(err);
      });
      res.redirect('/');
    } else {
      res.render('list', { listTitle: 'Today', newListItems: foundItems });
    }
  });
});

app.get('/:customListName', function (req, res) {
  const customListName = req.params.customListName;
  List.findOne({ name: customListName }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (!result) {
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItem,
        });
        list.save();
        res.redirect('/' + customListName);
      } else {
        // Show an existing list
        res.render('list', {
          listTitle: result.name,
          newListItems: result.items,
        });
      }
    }
  });
});

app.post('/', function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === 'Today') {
    item.save();
    res.redirect('/');
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      if (!err) {
        foundList.items.push(item);
        foundList.save();
        res.redirect('/' + listName);
      }
    });
  }
});

app.post('/delete', function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove({ _id: checkedItemId }, function (err, item) {
    if (err) {
      console.log(err);
    } else {
      console.log(item);
    }
  });
  res.redirect('/');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
