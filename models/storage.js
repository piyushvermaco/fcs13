const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MA');
const Schema = mongoose.Schema;


const storageSchema = new Schema({
    email:String,prvkey:String
});

const storage = mongoose.model('storage',storageSchema);
module.exports = storage;
mongoose.set('bufferCommands', false);