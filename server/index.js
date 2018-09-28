const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

const public = path.join(__dirname, "..", "front", "public");

const moment = require('moment')

const utilities = require('./services/util');
require('./models/Note');
require('./models/User');
require('./services/passport');

const app = express();
let notesCollection = [];

const db = mongoose.connection;
mongoose.connect(keys.mongoURI);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('DB connected');
});

const Note = mongoose.model('notes');
const User = mongoose.model('users')
app.use(
    cookieSession({
        maxAge:30*24*60*60*1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

app.use(express.static(path.join(__dirname, "..", "front", "public")));
app.use(bodyParser.json());

app.get("/removeNote/:id", async (req,res) => {
  let removedNote = await Note.findOneAndDelete({ _id : req.params.id});
  res.status(200).send();
})

app.get("/completeNote/:id", async (req,res) => {
  let removedNote = await Note.findOneAndUpdate({ _id : req.params.id}, { category : "done" });
  res.status(200).send();
})

app.post("/removeNotesAndCategory", async (req,res) => {
  let notes = await Note.find({_id: {$in : req.body.notesArray}});
  let notesRemoval = await Note.remove({_id : {$in : req.body.notesArray}});

  User.findOne({_id : req.user._id}, function(err,element){
    if(err){res.status(503).end();}
    element.categories = element.categories.filter((category) => {
      return category !== req.body.category
    })
    element.save();
    res.status(200).end();
  });
})

//

app.get("/getNotes", async (req, res) => {
  let k = await Note.find( {'authorId' : req.user.googleId} );
  res.status(200).send(JSON.stringify(k));
});

app.get("/auth/google/callback", (req,res) => {
  res.redirect("/");
})


app.post("/updateUser", (req,res) => {
User.findOne({ _id : req.user._id }, function(err, element){
  if(err){res.status(503).end();}
  element.userName = req.body.userName;
  element.save();
  res.status(200).end();
});

})

app.post("/addTodo", (req, res) => {
  new Note({
    title: req.body.title,
    timestamp: new Date(),
    content: req.body.content,
    author: req.body.author,
    authorId: req.user.googleId,
    category: req.body.category,
    deadline: moment(req.body.deadline).valueOf()
  }).save().then((saveResult) => {
    res.status(200).send(saveResult);
  }).catch((e) => {
    res.status(503).end();
  })
});

app.post("/addCategory", (req,res) => {
  User.findOne({ _id : req.user._id}, function (err,element){
    if(err){res.status(503).end()}
    element.categories = [...element.categories,req.body.category];
    element.save();
    res.status(200).end();
  })
})


app.listen(5050, () => {
  console.log("Listening on port 5050");
});
