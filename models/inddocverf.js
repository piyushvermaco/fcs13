const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MA');

const Schemadocs = mongoose.Schema;


const docSchema = new Schemadocs({
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
    addrprooftype:String
    // 
});

const inddocverf = mongoose.model('inddocverf',docSchema);

module.exports = inddocverf;

mongoose.set('bufferCommands', false);


// {timestamps:true}
    //     data:Buffer,
    //     contentType:String
    // },
    // file2:{
    //     data:Buffer,
    //     contentType:String
    // },
    // file3:{
    //     data:Buffer,
    //     contentType:String
    // }