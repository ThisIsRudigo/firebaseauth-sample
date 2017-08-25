const express = require('express');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

const reply = require('./middlewares/reply');
app.use(reply.setupResponder); //adds methods to res to return properly formatted response to user

const FirebaseAuth = require('firebaseauth');
var firebase = new FirebaseAuth(process.env.FIREBASE_API_KEY);

const serviceAccount = require("./firebase.json");

app.post('/login', function(req, res){
	var email = req.body.email;
	var password = req.body.password;

	firebase.signInWithEmail(email, password, function(err, response){
		if (err){
			return res.badRequest(err); //user error
		}

		res.success(response);
	})
});

app.post("/login/facebook", function(req, res){
	var access_token = req.body.access_token;

	firebase.loginWithFacebook(access_token, function(err, response){
		if (err){
			return res.badRequest(err); //user error
		}

		res.success(response);
	})
})

app.post('/register', function(req, res){
	var email = req.body.email;
	var password = req.body.password;
	var name = req.body.name;

	if (typeof(name) !== 'string' || name.trim().length < 2){
		return res.badRequest('Name is required');
	}

	firebase.registerWithEmail(email, password, name, function(err, response){
		if (err){
			return res.badRequest(err); //user error
		}

		res.success(response);
	})
});

//protect following endpoints
app.use(firebase.protect(serviceAccount));

//protect following endpoints with extra functionailites
// const protector_callback = require('./middlewares/protector_callback');
// app.use(firebase.protect(serviceAccount, protector_callback));

app.get('/profile', function(req, res){
	res.success(req.user);
});

var port = process.env.PORT || 8000;
app.listen(port, function(){
	console.log('listening on port ' + port);
});