var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../jwtConfig');
const bcrypt = require('bcrypt');

/* POST recieve the users submitted password and email and check them against the
database. If the user exists in the database, generate a token and send it to the user */
router.post('/', (req, res, next) => 
{
	// If one of the fields is not filled in, return an error message
	if (!req.body.email || !req.body.password)
	{
		res.status(401).json(
			{
				message: 'invalid login - you need to supply both an email and password'
			}
		);
	}

	else 
	{
		req.db.from("users").where("email", req.body.email).pluck('password')
		.then((password) => 
		{
			bcrypt.compare(req.body.password, password[0], function(err, ret)
			{
				if (ret)
				{
					var token = jwt.sign({email: req.body.email},
						config.secret,
						{expiresIn: '86400s'}
					);
				
					res.status(200).json({
						access_token: token,
						expires_in: '86400',
						token: token,
						token_type: 'Bearer'
					});

				} 
				else 
				{
					res.status(401).json({
						message: 'invalid login - bad password'
					})
				}
			})
		}).catch( () => {
			res.status(401).json({
				message: "oh no! It looks like that user doesn't exist..."
			});
		});
	}
});

module.exports = router;
