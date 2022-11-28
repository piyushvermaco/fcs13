const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MA');

const Schemadocsorg = mongoose.Schema;


const docSchemaorg = new Schemadocsorg({
    type:String,
    email:String,
    // photopath:String,
    photoname:String,
    phototype:String,

    // idproofpath:String,
    idproofname:String,
    idprooftype:String,

    // addrproofpath:String,
    addrproofname:String,
    addrprooftype:String,

    licname:String,
    lictype:String
    // 
});

const orgdocverf = mongoose.model('orgdocverf',docSchemaorg);

module.exports = orgdocverf;

mongoose.set('bufferCommands', false);