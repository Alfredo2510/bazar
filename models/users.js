var bcrypt= require("bcrypt-nodejs");
var mongoose= require("mongoose");

var SALT_FACTOR=10;

var userSchema=mongoose.Schema({
    Rol:{type:String, require:true},
    username:{type:String, require:true, unique:true},
    password:{type:String, require:true},
    CreatedAt:{type:Date, default:Date.now}
});

var donothing=()=>{
}

userSchema.pre("save", function(done){
    var users =this;
    if(!users.isModified("password")){
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR,(err,salt)=>{
        if(err){
            return done(err);
        }
        bcrypt.hash(users.password,salt,donothing,(err,hashedpassword)=>{
            if(err){
                return done (err);
            }
            users.password=hashedpassword;
            done();
        });
    });
});

userSchema.methods.checkPassword=function(guess,done){
    bcrypt.compare(guess,this.password,function(err,isMatch){
        done(err,isMatch);
    });
}

userSchema.methods.name=function(){
    return this.username||this.username;
}

var Users=mongoose.model("Users",userSchema);
module.exports=Users;