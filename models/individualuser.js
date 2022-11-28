const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MA');
const Schema = mongoose.Schema;


const individualSchema = new Schema({
    firstname:String,lastname:String,phone:String,gender:String,type:String,
    address:String,zipcode:Number,state:String,
    city:String,country:String,dob:Date,email:String,passwd:String,isverified:String,pubkey:String
});

const individualuser = mongoose.model('individualuser',individualSchema);
module.exports = individualuser;
mongoose.set('bufferCommands', false);