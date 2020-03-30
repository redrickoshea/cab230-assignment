var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* POST recieve the users submitted password and email, and store them in the database */
router.post('/', (req, res) => {
	
	// If either of the fields is not filled in, return an error message
	if (!req.body.email || !req.body.password)
	{
		res.status(400).json({
			message: "error creating new user - you need to supply both an email and password"
		});
	} 
	
	else 
	{
		bcrypt.hash(req.body.password, saltRounds, function(err, hash){

			req.db.raw("INSERT INTO users (email, password) values (:email, :password);",
			{email: req.body.email, password: hash})
			.then( () => {
				res.status(201).json({
					message: "yay! you've successfully registered your user account :)"
				});
			}).catch( (err) => {
				res.status(400).json({
					message: "oops! It looks like that user already exists :("
				});
			})
		})
	}
});

module.exports = router;
