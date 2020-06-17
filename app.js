//jshint esversion:6

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var url = "mongodb+srv://nirsh:1234@cluster0-z73l3.azure.mongodb.net/newdb";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({//creates the template
  name: String
});

const Item = mongoose.model('Item', itemsSchema);//creates the collection
// const items = ["Buy food","Eat Food"];

const item1 = new Item ({//creates item 1
  name: "Welcome to your todoList!!"
});

const item2 = new Item({//creates item 2
  name: "Hit the + button to add something"
});

const item3 = new Item({//creates item 3
  name: "Hit the checkbox to delete the task"
});

const defaultItems = [item1, item2, item3]; //creates items array called defaultItems



app.get("/", function(req, res) {

Item.find({},function(err,foundItems){//runs find on collection Item from itemsSchema in line 21. 'foundItems' can be called anything and is the items that are found. Condition inside {} is not required here. 
  console.log(foundItems); //can use this temporarily before front end is working to see items in the terminal
if(foundItems.length === 0)//if foundItems collection is empty...
{
  Item.insertMany(defaultItems, function (err) {//...then insert defaultItems from line 36
    if (err){
      console.log(err);
    } else {
      console.log ("Sucessfully saved default values");//...and console.log this message
    }
  });
  res.redirect("/");//...and redirect to home page
} else{
  res.render("list", {listTitle: "Today", newListItems: foundItems});//The "list" is the list.ejs page and newListItem is used in there in the form
}

});

});

app.post("/", function(req, res){

const itemName = req.body.newItem;

const item = new Item({
  name:itemName
});
item.save();
res.redirect("/");
});

app.post("/delete",function(req,res){

const checkedItemID = req.body.checkbox;
Item.findByIdAndRemove (checkedItemID,function(err){
  if (!err){
    console.log("Sucessfully deleted checked item");
    res.redirect("/");
  }
});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
