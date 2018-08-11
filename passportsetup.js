var passport = require("passport");
var Users= require("./models/users");
var LocalStrategy = require("passport-local").Strategy;

module.exports = () =>{
    passport.serializeUser((users, done)=>{
        done(null,users._id);
    });
    passport.deserializeUser((id, done)=>{
        Users.findById(id, (err, users)=>{
            done(err, users);
        });
    });
};

passport.use("login", new
LocalStrategy(function(username, password, done){
    Users.findOne({username:username}, function(err, users){
        if(err){
            return done (err);
        }
        if (!users){
            return done (null, false,{
                message:"No existe ningun usuario con ese nombre"})
        }
            users.checkPassword(password,(err, isMatch)=>{
                if(err){
                    return done(err);
                }
                if (isMatch){
                    return done(null, users)
                }else{
                    return done(null, false,{message:"la contraseña no es válida"})
                }
            })
    })
}
))