const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session') ;
const csrf = require('csurf');
var nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload')
const mail = require('./mail');
const fs = require('fs');

const NodeRSA = require('node-rsa');

let secret = "Baadi keemtgffffi siifdghhgf hai nazarfggggggggggg terii kii jabsekjhgf mujh par padhlyujthrgii, mai bada olyujhsasta sa tha, abb mehngaa hone lgaa huun, duniyaa lagee saltanat merii aur mai sultan hone lga huun!!!";
let secret1 = "sdfghjgfdghgfhgBaadi keemti sii hai nazar terii kii jabse mujh payhgtfrr padhii, mujyhgtrfai bada sasta sa tha, aikjuyhtgrfbb mehngaa hikyujthrgone lgaa huun, duniyaa lagee saltanat merii aur mai sultan hone lga huun!!!";

const app = express();
app.use(fileUpload());
//img
var multer = require('multer');

var user = "";


const inddocverf = require('./models/inddocverf');
const orgdocverf = require('./models/orgdocverf');

//Password handler
const bcrypt = require('bcrypt');

//Mongodb organisation user model
const organisationuser = require('./models/organisationuser');

//Mongodb Individual user model
const individualuser = require('./models/individualuser');
const medicalrecord = require('./models/medicalrecord');
//storage
const storage = require('./models/storage');

const csrfProtection = csrf();

const crypto = require('crypto');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
// configure cookie here
app.use(session({secret : 'This is a secret, it needs to be in the env file.', resave: false, saveUninitialized: false, cookie: {maxAge:1000*60*30}}))
app.use(csrfProtection);
// All get requests for webpages
app.get('/', function (req, res) {

    res.render('index');
})
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
})

app.get('/signup', function (req, res) {
    res.render('signup');
})

app.get('/login', function (req, res) {
    res.render('login');
})

app.get('/patientsignup', function (req, res) {
    res.render('patientSignup')
})

app.get('/HospSignup', function (req, res) {
    res.render('HospSignup')

})

app.get('/orgSignup', function (req, res) {
    res.render('orgSignup')

})

app.get('/forgot', function (req, res) {
    res.render('forgot')
})

app.get('/contact', function (req, res) {
    res.render('contact')
})

app.get('/otpverify', function (req, res) {

    res.render('otpverify')
})

app.get('/login_otpverify', function (req, res) {
    res.render('login_otpverify')
})

app.get('/doc_verify', function (req, res) {
    // console.log("here111")
    // console.log(req.session.email);
    res.render('doc_verify')
})

app.get('/org_doc_verify', function (req, res) {
    res.render('org_doc_verify')
})
app.get('/wating_admin_verify', function (req, res) {
    res.render('wating_admin_verify')
})

app.get('/logout', function (req, res) {

    req.session.destroy(function (err) {
        if (err){
            console.log(err)
        }
        else{
            res.redirect('/')
        }
    })
})

//Piyush
app.get('/dashboard', function (req, res) {
    res.render('pages/dashboard');
})

app.get('/layout', function (req, res) {
    res.render('pages/layout');
})
app.get('/profile', function (req, res) {
    res.render('pages/profile');
})

app.get('/maps', function (req, res) {
    res.render('pages/maps');
})

app.get('/tables', function (req, res) {
    res.render('pages/tables');
})


app.get('/icons', function (req, res) {
    res.render('pages/icons');
})

app.get('/profle', function (req, res) {
    res.render('pages/profile');
})

app.get('/approve', function (req, res) {
    res.render('pages/profile');
})

// Admin Dashboard

app.get('/adminDashboard', function (req, res) {

    individualuser.find({isverified:"false"}).then(a =>{
        organisationuser.find({isverified:"false"}).then(b =>{
            res.render('pages/adminDashboard/adminDashboard', {indUsers : a, orgUsers:b});

        })
    })
})


//Remove users by admin
app.get('/admin/delete/individual/:email', function (req, res) {

    individualuser.deleteOne({ email:req.params.email}).then(function(){
        console.log("Data deleted");
        res.redirect('/removeUsers')
    }).catch(function(error){
        console.log(error); // Failure
    });

})
app.get('/admin/delete/organisation/:email', function (req, res) {

    organisationuser.deleteOne({ email:req.params.email}).then(function(){
        console.log("Data deleted");
        res.redirect('/removeUsers')
    }).catch(function(error){
        console.log(error); // Failure
    });
})
app.get('/removeUsers', function (req, res) {

    individualuser.find().then(a =>{
        organisationuser.find().then(b =>{
            res.render('pages/adminDashboard/removeUsers', {indUsers : a, orgUsers:b});
        })
    })
})

// individual approve
app.get('/approveusers/:email', function (req, res) {
    console.log(req.params.email)
    individualuser.find({email:req.params.email}).then(c=>{
        var person = req.params.email
        const key = new NodeRSA({b:512});
        var encryptedString = key.encrypt(secret,'base64');
        var public_Key = key.exportKey('public');
        var private_Key = key.exportKey('private');
        let key_private = new NodeRSA(private_Key);
        let key_public = new NodeRSA(public_Key);
        individualuser.updateOne({pubkey:public_Key}, function (err, result) {
            if (err){console.log(err)}
        });
        individualuser.updateOne({isverified:"true"}, function (err, result) {
            if (err){console.log(err)}
        });
        const newstorage = new storage({
            email:person,prvkey:private_Key
        })
        newstorage.save()
    })
})

// approve organisation by admin
app.get('/approveorg/:email', function (req, res) {
    console.log(req.params.email)
    organisationuser.find({email:req.params.email}).then(c=>{
        console.log(req.params);
        console.log("HHHHHHHHHHHHHHHHHHHHHHhh")
        var person = req.params.email
        const key = new NodeRSA({b:512});
        var encryptedString = key.encrypt(secret,'base64');
        var public_Key = key.exportKey('public');
        var private_Key = key.exportKey('private');
        let key_private = new NodeRSA(private_Key);
        let key_public = new NodeRSA(public_Key);
        organisationuser.updateOne({pubkey:public_Key}, function (err, result) {
            if (err){console.log(err)}
        });
        console.log("here")
        organisationuser.updateOne({isverified:"true"}, function (err, result) {
            if (err){console.log(err)}
        });
        const newstorage = new storage({
            email:person,prvkey:private_Key
        })
        console.log("here")
        newstorage.save()
    })
})

app.get('/disapproveusers/:email', function (req, res) {
    var isApproved = "true";
    console.log(req.params.email+"GFD")
})

app.get('/adminProfile', function (req, res) {
    res.render('pages/adminDashboard/adminProfile');
})

// See Info About User For Admin Dashboard
app.get('/admin/organisation/:email', function (req, res) {
    organisationuser.find({email:req.params.email}).then(a =>{
        orgdocverf.find({email:req.params.email}).then(b =>{
            res.render('pages/adminDashboard/orgDocuments', {orgUsers : a, orgDoc:b});
        })
    })
})


app.get('/admin/individual/:email', function (req, res) {
    individualuser.find({email:req.params.email}).then(a =>{
        inddocverf.find({email:req.params.email}).then(b =>{
            res.render('pages/adminDashboard/userDocuments', {indUsers : a, indDoc:b});
        })
    })
})


// Organization Dashboard

app.get('/organizationDashboard', function (req, res) {
    res.render('pages/organisationDashboard/organizationDashboard');
})

app.get('/approveUsers', function (req, res) {
    res.render('pages/adminDashboard/approveUsers');
})

app.get('/removeUsers', function (req, res) {
    res.render('pages/adminDashboard/removeUsers');
})

app.get('/organizationProfile', function (req, res) {
    res.render('pages/organizationDashboard/organizationProfile');
})

// Patient Dashboard

app.get('/patientDashboard', function (req, res) {
    individualuser.find({type:"Healthcare", isverified:"true"}).then(a =>{
        organisationuser.find({type:"Hospital", isverified:"true"}).then(b =>{
            organisationuser.find({type:"Pharmacy", isverified:"true"}).then(c =>{
                organisationuser.find({type:"Insurance", isverified:"true"}).then(d =>{
                  res.render('pages/patientDashboard/patientDashboard', {indUsers : a, hospital:b, pharmacy:c, insurance:d});
                })
            })
        })
    })
})

app.get('/patientProfile', function (req, res) {
    res.render('pages/patientDashboard/patientProfile');
})

app.get('/uploadPatientDocument', function (req, res) {
    res.render('pages/patientDashboard/uploadPatientDocument');
})


// See Info About Health Organization And Professionals For Patient Dashboard

app.get('/patient/hospital/:email', function (req, res) {
    var email = req.session.email
    var orgEmail = req.params.email
    organisationuser.find({email:orgEmail}).then(a =>{
        medicalrecord.find({email}).then(result =>{
            var sharedDocs = []
            var notSharedDocs = []
            for(var i=0; i< result.length; i++){
                if(result[i].sharedUsers.includes(orgEmail)){
                    sharedDocs.push(result[i])
                }
                else{
                    notSharedDocs.push(result[i])
                }
            }
            res.render("pages/patientDashboard/hospitalFunctions", {sharedDocs : sharedDocs, notSharedDocs : notSharedDocs, orgUsers: a})
        })
    })
})
app.get('/patient/pharmacy/:email', function (req, res) {
  var email = req.session.email
  var orgEmail = req.params.email
  organisationuser.find({email:orgEmail}).then(a =>{
      medicalrecord.find({email}).then(result =>{
          var sharedDocs = []
          var notSharedDocs = []
          for(var i=0; i< result.length; i++){
              if(result[i].sharedUsers.includes(orgEmail)){
                  sharedDocs.push(result[i])
              }
              else{
                  notSharedDocs.push(result[i])
              }
          }
          res.render("pages/patientDashboard/pharmacyFunctions", {sharedDocs : sharedDocs, notSharedDocs : notSharedDocs, orgUsers: a})
      })
  })
})

app.get('/patient/insurance/:email', function (req, res) {
    organisationuser.find({email:req.params.email}).then(a =>{
        orgdocverf.find({email:req.params.email}).then(b =>{
            res.render('pages/patientDashboard/insuranceFunctions', {orgUsers : a, orgDoc:b});
        })
    })
})

app.get('/patient/individual/:email', function (req, res) {
  var email = req.session.email
  var orgEmail = req.params.email
  individualuser.find({email:orgEmail}).then(a =>{
      medicalrecord.find({email}).then(result =>{
          var sharedDocs = []
          var notSharedDocs = []
          for(var i=0; i< result.length; i++){
              if(result[i].sharedUsers.includes(orgEmail)){
                  sharedDocs.push(result[i])
              }
              else{
                  notSharedDocs.push(result[i])
              }
          }
          res.render("pages/patientDashboard/healthprofFunctions", {sharedDocs : sharedDocs, notSharedDocs : notSharedDocs, orgUsers: a})
      })
  })
})

app.post('/updatePatientDocument', function (req, res) {

    var filepath = 'public/med_records/' + req.files.healthrecord.name
    req.files.healthrecord.mv('./' + filepath)
    var hash = ""
    if(fs.existsSync(filepath)){
        const filebuffer = fs.readFileSync(filepath)
        const hashsum = crypto.createHash('md5')
        hashsum.update(filebuffer)
        console.log("Check if");
        hash = hashsum.digest('base64')
    }
    console.log( hash)
    var email = req.session.email
    var filename = req.body.filename

    individualuser.find({email}).then(result =>{
        var public_Key = NodeRSA(result[0].pubkey)
        var encHash = public_Key.encrypt(hash, 'base64')
        var newMedicalRecord = medicalrecord({email : email, filepath:filepath, filename:filename, encHash:encHash, sharedUsers:[]})
        newMedicalRecord.save()
        res.redirect("/patientDashboard")

    })

})

app.get('/deletePatientMediacalRecord', function (req, res) {
    var email = req.session.email
    console.log(email);
    medicalrecord.find({email}).then(result =>{
        res.render("pages/patientDashboard/deleteMedicalRecords",{documents : result})
    })
})
app.get('/delete/:filename', function (req, res) {
    var email = req.session.email
    var filename = req.params.filename

    medicalrecord.find({filename, email}).then(result =>{
        console.log(result[0].filepath);
        if(fs.existsSync(result[0].filepath)){
            fs.unlinkSync(result[0].filepath)
            console.log("file deleted")
        }
    })
    medicalrecord.deleteOne({filename, email}).then(result =>{
        res.redirect("/deletePatientMediacalRecord")
    })

})

app.get('/hospital/:filename/:email', function (req, res) {
    var email = req.session.email
    var filename = req.params.filename
    var orgEmail = req.params.email
    medicalrecord.findOne({email, filename}).then(result =>{

        if(fs.existsSync(result.filepath)){
            const filebuffer = fs.readFileSync(result.filepath)
            const hashsum = crypto.createHash('md5')
            hashsum.update(filebuffer)
            const compHash = hashsum.digest('base64')
            storage.findOne({email}).then(resul =>{
                var key_private = new NodeRSA(resul.prvkey)
                var decHash = key_private.decrypt(result.encHash, 'base64')
                console.log(compHash)
                console.log(decHash);
                if (decHash == compHash){
                    result.sharedUsers.push(orgEmail)
                    res.render("", {uploadedDocs: result})
                }
            })


        }
        else{
            console.log('file not found')
        }
    })
})

app.get('/patientProfile', function (req, res) {
    organisationuser.find({email:req.params.email}).then(a =>{
        orgdocverf.find({email:req.params.email}).then(b =>{
            res.render('pages/adminDashboard/orgDocuments', {orgUsers : a, orgDoc:b});
        })
    })
})

//Remove Medical Record by Patient

app.get('/patient/delete/medicalRecord/:email', function (req, res) {

    organisationuser.deleteOne({ email:req.params.email}).then(function(){
        console.log("Data deleted");
        res.redirect('/removeUsers')
    }).catch(function(error){
        console.log(error); // Failure
    });
})
app.get('/deleteMedicalRecords', function (req, res) {

    individualuser.find().then(a =>{
        organisationuser.find().then(b =>{
            res.render('pages/patientDashboard/deleteMedicalRecords', {indUsers : a, orgUsers:b});
        })
    })
})


// All post requests from forms

app.post('/patientSignup', function (req, res) {

    var individualData = req.body
    let{ firstname,lastname,phone,gender,type,address,zipcode,state,city,country,dob,email,passwd} = individualData;
    firstname = individualData.firstName;
    lastname = individualData.lastName;
    phone = individualData.phoneNumber;
    gender = individualData.gender;
    type = individualData.orgType;
    address = individualData.address;
    zipcode = individualData.zipCode;
    state = individualData.state;
    city = individualData.city;
    country = individualData.country;
    dob = individualData.dob;
    email = individualData.email;
    passwd = individualData.password;


    if(firstname==""||lastname==""||phone==""||gender==""||type==""||address==""||zipcode==""||state==""||city==""||country==""||dob==""||email==""||passwd==""){
        res.redirect('/patientSignup')
    }
    else if(!/^[a-zA-Z ]*$/.test(firstname)){
        res.send("Invalid Name Entered!")
        // res.redirect('/patientSignup')

    }
    else if(!/^[a-zA-Z ]*$/.test(lastname)){
        res.send("Invalid Last Name Entered!")
    }
    else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.send({
            status:"FAILED",
            message:"Invalid email Entered"
        })
    }

    else{
        // check if user is already present or not !
        individualuser.find({email}).then(result=>{
            if(result.length){
                //A user already exists
                res.json({
                    status:"FAILED",
                    message:"User already exist with that email"
                })
            }
            else{
                // try to create a new user!
                // passwd handling
                const saltRounds = 10;
                bcrypt.hash(passwd,saltRounds).then(hashedpasswd=>{
                    const newindividualuser = new individualuser({
                        firstname,lastname,phone,gender,type,address,zipcode,state,city,country,dob,email,passwd:hashedpasswd,isverified:"false",pubkey:"null"});
                        console.log(newindividualuser)
                        console.log("Signup succesful")
                        console.log(newindividualuser)
                        console.log("Signup succesful")
                        user = newindividualuser;
                        otp = Math.floor(Math.random()*900000 + 100000)
                        mail.sendMail(email, otp)

                        // req.session.isLoggedIn = true;
                        res.redirect('/otpverify');
                }).catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"Error occured while hashing passwd!"
                    })
                })
            }


        }).catch(err=>{
            console.log(err);
            res.json({
                status:"FAILED",
            message:"Error occurred while checking for existing user!"
            })
        })

    }
})


app.post('/orgSignup', function (req, res) {
    var organisationData = req.body
    let{ firstname,phone,type,address,zipcode,state,city,country,email,passwd} = organisationData;
    firstname = organisationData.orgName;
    phone = organisationData.profession;
    type = organisationData.orgType;
    address = organisationData.address;
    zipcode = organisationData.zipCode;
    state = organisationData.state;
    city = organisationData.city;
    country = organisationData.country;
    phone = organisationData.phoneNumber;
    email = organisationData.email;
    passwd = organisationData.password;

    if(firstname==""||phone==""||type==""||address==""||zipcode==""||state==""||city==""||country==""||email==""||passwd==""){
        res.redirect('/orgSignup')
    }
    else if(!/^[a-zA-Z ]*$/.test(firstname)){
        res.json({
            status:"FAILED",
            message:"Invalid firstname Entered"
        })
    }
    else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status:"FAILED",
            message:"Invalid email Entered"
        })
    }

    else{
        // check if user is already present or not !
        organisationuser.find({email}).then(result=>{
            if(result.length){
                //A user already exists
                res.json({
                    status:"FAILED",
                    message:"User already exist with that email"
                })
            }
            else{
                // try to create a new user!
                // passwd handling
                const saltRounds = 10;
                bcrypt.hash(passwd,saltRounds).then(hashedpasswd=>{
                    const neworganisationuser = new organisationuser({
                        firstname,phone,type,address,zipcode,state,city,country,email,passwd:hashedpasswd,isverified:"false",pubkey:String});
                        console.log("Signup succesful")

                        user = neworganisationuser;
                        otp = Math.floor(Math.random()*900000 + 100000)
                        mail.sendMail(email, otp)

                        // req.session.isLoggedIn = true;
                        res.redirect('/otpverify');
                }).catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"Error occured while hashing passwd!"
                    })
                })
            }


        }).catch(err=>{
            console.log(err);
            res.json({
                status:"FAILED",
            message:"Error occurred while checking for existing user!"
            })
        })

    }
})

var otp = ""

app.post('/otpverify', function (req, res) {
    var otpData = req.body
    if (otp == otpData.otp){
        console.log('otp verified')
        otp = ""
        user.save();
        res.render('login')
    }
    else{
        res.redirect('/')
    }

})


app.post('/login_otpverify', function (req, res) {
    var otpData = req.body
    if (otp == otpData.otp){
        console.log('otp verified')
        otp = ""
        req.session.isLoggedIn = true ;
        if(req.session.type ==  "individual"){
            email = req.session.email;
            console.log("here "+email)
            inddocverf.find({email}).then(result=>{
                console.log(result)
                if(result.length != 0){
                    individualuser.find({email}).then(result=>{
                        if(result[0].isverified=="false"){
                            console.log("hii")
                            res.redirect('/wating_admin_verify')
                        }
                        else{
                            res.redirect('/patientDashboard')
                        }
                    })
                }
                else{
                    res.redirect('doc_verify')
                }
            })
        }
        else{
          email = req.session.email;
          console.log("here "+email)
          orgdocverf.find({email}).then(result=>{
              if(result.length != 0){
                  organisationuser.find({email}).then(result=>{
                      if(result[0].isverified=="false"){
                          console.log("hii")
                          res.redirect('/wating_admin_verify')
                      }
                      else{
                          res.redirect('/organizationDashboard')
                      }
                  })
              }
              else{
                  res.redirect('org_doc_verify')
              }
          })
        }
    }
    else{
        res.redirect('/');
    }

})

app.post('/org_doc_verify', function (req, res) {

    if(req.session.isLoggedIn===true){
        if(req.files.orgPhoto.size<=999999){
            if(req.files.orgIdentityProof.size<=999999){
                if(req.files.orgAddressProof.size<=999999){
                    if(req.files.orgHealthLicense.size<=999999){

                        var p1 = req.files.orgPhoto.mv('./public/organisationuploads/'+req.files.orgPhoto.name)
                        var p2 = req.files.orgIdentityProof.mv('./public/organisationuploads/' + req.files.orgIdentityProof.name)
                        var p3 = req.files.orgAddressProof.mv('./public/organisationuploads/' + req.files.orgAddressProof.name)
                        var p4 = req.files.orgHealthLicense.mv('./public/organisationuploads/' + req.files.orgHealthLicense.name)

                        photoname = './organisationuploads/' + req.files.orgPhoto.name
                        phototype = req.files.orgPhoto.mimetype
                        idproofname = './organisationuploads/' + req.files.orgIdentityProof.name
                        idprooftype = req.files.orgIdentityProof.mimetype
                        addrproofname = './organisationuploads/' + req.files.orgAddressProof.name
                        addrprooftype = req.files.orgAddressProof.mimetype
                        licname = './organisationuploads/' + req.files.orgHealthLicense.name
                        lictype = req.files.orgHealthLicense.mimetype

                        const orgdocsfiles = new orgdocverf({
                            type:req.session.type,
                            email:req.session.email,photoname,phototype,idproofname,idprooftype,addrproofname,addrprooftype,
                            licname,lictype
                        });
                        console.log(orgdocsfiles);
                        orgdocsfiles.save();
                        console.log('Files uploaded Successfully');
                        // res.render('wating_admin_verify')
                    }
                    else{console.log("file size greater than specified 11!")}
                }
                else{console.log("file size greater than specified 1!")}
            }
            else{console.log("file size greater than specified 2!")}
        }
        else{console.log("file size greater than specified 3!")}
        res.render('wating_admin_verify')
    }
    else{
        res.redirect('/')
    }
})

app.post('/doc_verify',function(req,res){

    if(req.session.isLoggedIn===true){
        if(req.files.indPhoto.size<=999999)
        {
            if(req.files.indIdentityProof.size<=999999){

                if(req.files.indAddressProof.size<=999999){
                    var p1 = req.files.indPhoto.mv('./public/individualuploads/'+req.files.indPhoto.name)
                    var p2 = req.files.indIdentityProof.mv('./public/individualuploads/' + req.files.indIdentityProof.name)
                    var p3 = req.files.indAddressProof.mv('./public/individualuploads/' + req.files.indAddressProof.name)

                    photoname = './individualuploads/' + req.files.indPhoto.name
                    phototype = req.files.indPhoto.mimetype
                    idproofname = './individualuploads/' + req.files.indIdentityProof.name
                    idprooftype = req.files.indIdentityProof.mimetype
                    addrproofname = './individualuploads/' + req.files.indAddressProof.name
                    addrprooftype = req.files.indAddressProof.mimetype

                    const inddocsfiles = new inddocverf({
                        type:req.session.type,
                        email:req.session.email,photoname,phototype,idproofname,idprooftype,addrproofname,addrprooftype
                    });
                    console.log(inddocsfiles);
                    inddocsfiles.save();
                    console.log('Files uploaded Successfully');
                    res.render('wating_admin_verify')
                }
                else{console.log("file size greater than specified 1!")}
            }
            else{console.log("file size greater than specified 2!")}
        }
        else{console.log("file size greater than specified 3!")}
    }
    else{
        res.redirect('/')
    }


});


app.post('/forgot', function (req, res) {
    var email = req.body.email
    // res.send(email)
})

app.post('/login', function (req, res) {

    var loginData = req.body
    // var loginData1 = loginData.clone

    let{email,password,type} = loginData;
    // let{email1,pass1} = loginData1;
    console.log(email+password)
    console.log('/n')
    console.log(email,password)

    let check = 1;


    if(email=="" || password==""){
        res.json({
            status:"FAILED",
            message:"Empty Credentials Supplied"
        })
        check = 0;
    }

    if(type=="individual"){
        if(check==1){
            individualuser.find({email})
            .then(data=>{
                if(data){
                    // User exists
                    const hashedpassword = data[0].passwd;
                    bcrypt.compare(password, hashedpassword).then(result=>{
                        if(result){
                            console.log("Signin succesful")
                            check = 0;
                            req.session.email = email;
                            req.session.type = type;
                            otp = Math.floor(Math.random()*900000 + 100000)
                            mail.sendMail(email, otp)

                            // req.session.isLoggedIn = true;
                            res.redirect('/login_otpverify');
                        }
                        else{
                            res.json({
                                status:"FAILED",
                                message:"Invalid Password entered!"
                            })
                        }
                    }).catch(err=>{
                        res.json({
                            status:"FAILED",
                            message:"An error Occured while checking for existing user!"
                        })
                    })

                }
            })
        }
    }

    else{
        organisationuser.find({email})
        .then(data=>{
            if(data){
                // User exists
                const hashedpassword = data[0].passwd;
                bcrypt.compare(password, hashedpassword).then(result=>{
                    if(result){
                        console.log("Signin succesful")

                        req.session.email = email;
                        req.session.type = type;
                        otp = Math.floor(Math.random()*900000 + 100000)
                        mail.sendMail(email, otp)
                        // req.session.isLoggedIn = true;
                        res.redirect('/login_otpverify');
                    }
                    else{
                        res.json({
                            status:"FAILED",
                            message:"Invalid Password entered!"
                        })
                    }
                }).catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"An error Occured while checking for existing user!"
                    })
                })

            }
        })
    }

    // res.send(loginData)

    // res.render('login_otpverify')
})

app.post('/contact', function (req, res) {
    var contactData = req.body
    // res.send(contactData)
})


// Dashboard Main

app.post('/adminDashboard', function (req, res) {
    var email = req.body.email
    // res.send(email)
})



//app running on http://localhost:3000/
app.listen(3000, function () {
    console.log('Server running on port 3000')
})


// for file from shivam 12.07am
app.get('/admin/:type/:extension/:filefolder/:filename', function (req, res) {

    if(req.params.type == 'application'){

        var filepath = 'public/' + req.params.filefolder + '/' + req.params.filename
        console.log(filepath)
        if (fs.existsSync(filepath)) {
            res.contentType("application/pdf");
            fs.createReadStream(filepath).pipe(res)
        }else{
            console.log('file not found')
        }
    }
    else if(req.params.type == 'image'){
        var filepath = 'public/' + req.params.filefolder + '/' + req.params.filename
        console.log(filepath)
        if (fs.existsSync(filepath)) {
            res.contentType("image/jpg");
            fs.createReadStream(filepath).pipe(res)
        }else{
            console.log('file not found')
        }
    }
})
