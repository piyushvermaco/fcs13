const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MA');

const Schemakeys = mongoose.Schema;


const keysSchema = new Schemakeys({
    type:String,
    email:String
});

const organisationuser = mongoose.model('organisationuser',OrganisationSchema);

module.exports = organisationuser;

mongoose.set('bufferCommands', false);