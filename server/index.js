const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const moment = require('moment');
const keys = require('./config/keys');

require('./models/Note');
require('./models/User');
require('./services/passport');

const app = express();
const db = mongoose.connection;
mongoose.connect(keys.mongoURI);

// eslint-disable-next-line
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
});

const Note = mongoose.model('notes');
const User = mongoose.model('users');
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  }),
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

app.use(express.static(path.join(__dirname, '..', 'front', 'public')));
app.use(bodyParser.json());

app.get('/removeNote/:id', async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id });
  res.status(200).send();
});

app.get('/completeNote/:id', async (req, res) => {
  await Note.findOneAndUpdate({ _id: req.params.id }, { category: 'done' });
  res.status(200).send();
});

app.post('/removeNotesAndCategory', async (req, res) => {
  await Note.find({ _id: { $in: req.body.notesArray } });
  await Note.remove({ _id: { $in: req.body.notesArray } });

  User.findOne({ _id: req.user._id }, (err, element) => {
    if (err) { res.status(503).end(); }
    // eslint-disable-next-line
    element.categories = element.categories.filter(category => category !== req.body.category); //
    element.save();
    res.status(200).end();
  });
});

//

app.get('/getNotes', async (req, res) => {
  const k = await Note.find({ authorId: req.user.googleId });
  res.status(200).send(JSON.stringify(k));
});

app.get('/auth/google/callback', (req, res) => {
  res.redirect('/');
});


app.post('/updateUser', (req, res) => {
  User.findOne({ _id: req.user._id }, (err, element) => {
    if (err) { res.status(503).end(); }
    // eslint-disable-next-line
    element.userName = req.body.userName;
    element.save();
    res.status(200).end();
  });
});

app.post('/addTodo', (req, res) => {
  new Note({
    title: req.body.title,
    timestamp: new Date(),
    content: req.body.content,
    author: req.body.author,
    authorId: req.user.googleId,
    category: req.body.category,
    deadline: moment(req.body.deadline).valueOf(),
  }).save().then((saveResult) => {
    res.status(200).send(saveResult);
  }).catch((e) => {
    res.status(503).end(e);
  });
});

app.post('/addCategory', (req, res) => {
  User.findOne({ _id: req.user._id }, (err, element) => {
    if (err) { res.status(503).end(); }
    // eslint-disable-next-line
    element.categories = [...element.categories, req.body.category];
    element.save();
    res.status(200).end();
  });
});


app.listen(5050, () => {
});
