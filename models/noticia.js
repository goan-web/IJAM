var mongoose = require('mongoose');

var NoticiaSchema = new mongoose.Schema({
	titulo:{type:String},
	fecha:{type: String},
	cover:[{type:String }],
	descripcion:{type: String},
	photos:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: "Photo"
	}]
},{collection:'noticia'});

var noticia = module.exports = mongoose.model('noticia', NoticiaSchema);