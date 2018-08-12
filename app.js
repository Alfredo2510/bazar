var express= require("express"); //Trabajar con el protocolo HTTP.
var mongoose= require("mongoose"); //Provee de métodos y funcionalidades para trabajar de mejor manera con MongoDB.
var path= require("path"); //Para acceder a las rutas.
var bodyParser= require("body-parser"); //Nos permite convertir los datos que nos lleguen en las peticiones al servidor en objetos json.
var cookieParser= require("cookie-parser"); //puede habilitar el soporte de cookies firmado pasando una cadena secreta
var flash= require("connect-flash"); //El flash generalmente se usa en combinación con redireccionamientos, lo que garantiza que el mensaje esté disponible para la próxima página que se va a procesar.
var session=require("express-session"); //pripiedades de el login del usaurios
var passport = require("passport"); //Passport es un middleware de autenticación para Node
var favicon = require('serve-favicon')

var passportsetup = require("./passportsetup");
var routes= require("./routes"); //
var app= express();

mongoose.connect("mongodb://bazar:bazar01@ds215172.mlab.com:15172/bazar");
passportsetup(); 

app.set("views",path.resolve(__dirname,"views"));


app.set("view engine","ejs");

app.use(express.static('./'));
app.use(express.static('./public'));
app.use(favicon(path.join(__dirname, 'public', 'celular.ico')))

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:"TKRvTKR",
    resave: true,
    saveUninitialized:true
}));
app.use(flash());

app.use(passport.initialize({
    userProperty:"users"
}));
app.use(passport.session());

app.use(routes);

app.listen(3000, function(){
    console.log("servidor corriendo puerto 3000");
});