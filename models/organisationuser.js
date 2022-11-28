const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MA');

const SchemaOrg = mongoose.Schema;


const OrganisationSchema = new SchemaOrg({
    firstname:String,phone:String,type:String,
    address:String,zipcode:Number,state:String,
    city:String,country:String,dob:Date,email:String,passwd:String,isverified:String,pubkey:String
});

const organisationuser = mongoose.model('organisationuser',OrganisationSchema);

module.exports = organisationuser;

mongoose.set('bufferCommands', false);