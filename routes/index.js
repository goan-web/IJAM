var express = require('express');
var router = express.Router();

var contacto = require('../models/contacto');
var mongoose = require('mongoose');
var noticia = require('../models/noticia');

/* GET home page. */

router.get('/', function(req, res, next) {
	noticia.find(function(err, noticias){
		if (err) res.send(err);
		res.render('index',{title:'IJAM',noticias:noticias});
	});
});

router.post('/', function(req, res, next){
	var data = {
		nombre: req.body.nombre,
		email: req.body.email,
		carrera: req.body.carrera,
		turno: req.body.turno,
		sede: req.body.sede,
		telefono: req.body.telefono
	};
	contacto.create(data,(err, contactos) => {
		if(err) res.send(err);
		res.redirect('/');
	});
});


module.exports = router;
