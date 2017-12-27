

var express = require('express');
var contacto = require('../models/contacto');
var mongoose = require('mongoose');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	contacto.find(function(err, contactos){
		if (err) res.send(err);
		res.render('/',{contactos:contactos});
	});
});


module.exports = router;