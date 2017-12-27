var mongoose = require('mongoose');


var ContactoSchema = mongoose.Schema({
	nombre: {type: String},
	email: {type: String},
	carrera: {type: String},
	turno: {type:String},
	sede: {type: String},
	telefono: {type: String}
},{collection:'contacto'});

var contacto = module.exports = mongoose.model('contacto', ContactoSchema);

