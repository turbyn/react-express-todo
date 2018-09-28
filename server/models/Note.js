const mongoose = require('mongoose');
const {Schema} = mongoose;

const noteSchema = new Schema({
    'title': String,
    'timestamp': Number,
    'content': String,
    'author': String,
    'authorId': String,
    'category': String,
    'deadline': Number
});

mongoose.model('notes', noteSchema);
