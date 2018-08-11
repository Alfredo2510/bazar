var express= require("express");
var Users= require("./models/users");
var Productos = require("./models/registros");
var Hogar = require("./models/registros");
var passport=require("passport");
var acl =require('express-acl');
    //equipment

const path = require('path');
const multer = require('multer');

var ID;

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        ID = Date.now();
      cb(null,file.fieldname + '-' + ID + ".png");
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('myImage');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
}

var router= express.Router();

router.use((req,res,next)=>{
    res.locals.currentUsers=req.users;
    res.locals.errors=req.flash("error");
    res.locals.infos=req.flash("info");

    if(req.users){
        req.session.Rol=req.session.Rol;
    }

    if (req.session.Rol==undefined){
        acl.config({
            baseUrl:'/',
            defaultRole:'Invitado',
        });
    }else{
        acl.config({
            baseUrl:'/',
            defaultRole:req.session.Rol
        });
    }
    next();
});
router.use(acl.authorize);

router.get("/",(req,res,next)=>{
    Productos.find()
    .exec((err, pro)=>{
        if(err)
        {
            return next(err);
        }
        res.render("index", {pro: pro});
    });
});

router.get("/login",(req,res,next)=>{
    res.render("login");
});

router.post("/login", passport.authenticate("login",{
    successRedirect:"/index",
    failureRedirect:"/login",
    failureFlash:true
}));

router.get("/registrar",(req,res,next)=>{
    res.render("registrar");
});

router.post("/registrar", (req,res,next)=>{
    var Rol = req.body.Rol;
    var username = req.body.username;
    var password = req.body.password;

    Users.findOne({username:username}, (err, user)=>{
        if(err){
            return next(err);
        }
        if (user){
            req.flash("error","El nombre de usuario ya está en uso :(");
            return res.redirect("/registrar");
        }
            var newUser = new Users({
                Rol: Rol,
                username: username,
                password: password
            });
            newUser.save(next);
            return res.redirect("/login");
    });
});

router.get("/salir", (req, res)=>{
    req.session.Rol='Invitado';
    req.logout();
    res.redirect("/");
});

router.get("/registro-p", (req,res,next)=>{
    res.render("registro-p");
});

router.post("/registro-p", (req, res, next)=> {
    upload(req, res, (err) => {
        var name = req.body.name;
        var money = req.body.money;
        var category = req.body.category;
        var description = req.body.description;

        if(err){
            return res.render('registro-p', {
                msg: err
            });
        }
        else {
            if(req.file == undefined){
                return res.render('registro-p', {
                    msg: 'Imagen no seleccionada'
                })
            }
            else{
                Productos.findOne((err) => {
                    var newCel = new Productos({
                        name: name,
                        money: money,
                        category: category,
                        description: description,
                        ID: ID
                    });
                    newCel.save(next);
                    return res.redirect("/");
               //     req.flash("info", "Producto agregado");
                  
                });
            
            }
        }
    });    
});

router.get("/index", (req, res, next)=>{
    Productos.find()
    .exec((err, pro)=>{
        if(err)
        {
            return next(err);
        }
        res.render("index", {pro: pro});
    });
});

router.get("/hogar", (req, res, next)=>{
    Hogar.find()
    .exec((err, pro)=>{
        if(err)
        {
            return next(err);
        }
        res.render("hogar", {pro: pro});
    });
});



module.exports=router;