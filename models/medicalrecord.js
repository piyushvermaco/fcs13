const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MA');
const Schema = mongoose.Schema;


const medicalRecordSchema = new Schema({
    email:String, filepath:String, filename:String, encHash:String , sharedUsers:[String]
});

const medicalrecord = mongoose.model('medicalrecord',medicalRecordSchema);
module.exports = medicalrecord;
mongoose.set('bufferCommands', false);
