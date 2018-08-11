var mongoose= require("mongoose");

var HogarSchema = mongoose.Schema({
    name: {type: String, required: true},
    money: {type: Number, required: true},
    category: {type: String, required: true},
    description: {type: String, required: true},
    ID: {type: String, required: true}
});

var Productos = mongoose.model("Productos", registroSchema);

module.exports=Productos;
