var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	}
});
 
var upload = multer({ storage: storage }).single("image");

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var contacto = require('../models/contacto');
var User = require('../models/user');
var noticia = require('../models/noticia');

/* GET users listing. */
// AUTHENTICATE RUTAS APP

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/settings/login');
	}
}


router.get('/noticias', function(req, res, next){
	noticia.find(function(err, noticias){
		if(err) res.send(err);
		res.render('noticias',{noticias:noticias});
	});
});

router.post('/noticias',function(req, res, next){
	upload(req, res, function(err){
		if (err) {
			return res.end('Error uploading file');
		}
		// get data from form
		var newTitulo = req.body.titulo,
			newFecha = req.body.fecha,
			newCover = "/uploads/" + req.file.filename,
			newDescripcion = req.body.descripcion;
		//Packing into an Object
		var newNoticia = {
			titulo: newTitulo,
			fecha: newFecha,
			cover: newCover,
			descripcion: newDescripcion
		};
		noticia.create(newNoticia, function(err, noticias){
			if (err) {
				console.log(err);
			}else{
				res.redirect('/settings/noticias');
			}
		});
	});

});


router.get('/inscripciones', ensureAuthenticated, function(req, res, next){
	contacto.find(function(err, contacts){
		if(err) res.send(err);
		res.render('inscripciones',{contacts:contacts});
	});
});

// LISTA DE ADMINISTRADORES
router.get('/', ensureAuthenticated,  function(req, res, next){
	User.find(function(err, docs){
		if(err) res.send(err);
		res.render('settings',{docs:docs});
	});
});

// Register
router.get('/register', function(req, res){
		User.find(function(err, docs){
		if(err) res.send(err);
		res.render('register',{docs:docs});
	});
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password,
			password2: password2

		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/settings/login');
	}
});

passport.use(new LocalStrategy(function(username, password, done) {
	User.getUserByUsername(username, function(err, user){
		if(err) throw err;
		if(!user){
			return done(null, false, {message: 'Unknown User'});
		}

		User.comparePassword(password, user.password, function(err, isMatch){
			if(err) throw err;
			if(isMatch){
				return done(null, user);
			} else {
				return done(null, false, {message: 'Invalid password'});
			}
		});
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', {successRedirect:'/settings', failureRedirect:'/settings/login',failureFlash: true}),
	function(req, res) {
		res.redirect('/settings');
});

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/settings/login');
});

module.exports = router;
