var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const config = require('../jwtConfig')

// Filter the user's input into a format usable in an SQL WHERE IN statement
function filter(query)
{
	var array = [];
	var i = 0;
	while(true)
	{
		if (query.indexOf(",") !== -1)
		{
			var index = query.indexOf(",");
			array[i] = query.slice(0, index).trim();
			query = query.slice(index + 1, query.length);
			i++;
		} 
		
		else 
		{
			array[i] = query.slice(0, query.length).trim();
			break;
		}
	}
	return(array);
}

// Check to see if the user has supplied an offence query.
router.get("/", function(req, res, next) 
{
	if (!req.query.offence)
	{
		res.status(400).json({
			error: "oops! it looks like you're missing the offence query parm"
		})
	} 
	
	else {
		next();
	}
});

// Check to see if the request includes an authorization header. If not, throw an error
router.use(function(req, res, next)
{

	if (!req.headers['authorization'])
	{
		res.status(401).json({
			error: "oops! it looks like you're missing the authorization header"
		})
	} 
	
	else 
	{
		next();
	}
})

// Attempt to validate the token. If validation fails, throw an error
router.use(function(req, res, next)
{
	var token = req.headers['authorization'];
	if (token.startsWith("Bearer "))
	{
		token = token.slice(7, token.length);
	}

	jwt.verify(token, config.secret, (err) => {
		if (err)
		{
			return res.status(401).json({
				error: "oh no! it looks like your authorization token is invalid..."
			});
		} 
		
		else 
		{
			next();
		}
	});
})

/* GET an array of areas and the amount of a specific type of offence that occured in
that area. optional filtering for area, year commited and age of offender */
router.use(function(req, res) 
{

	// Get the "column" equivalent of then user's selected offence
	req.db.raw("SELECT offence_columns.column FROM offence_columns WHERE pretty = :offence;",
	{offence: req.query.offence})
	.then((resp) => {

		//Arrays to hold user's queries in a format usable by sql WHERE IN statement
		var areas = [], ages = [], years = [], months = [], genders = [];
	
		// Parse the user's query in order to generate the correct SQL query
		var query = "SELECT offences.area AS LGA, SUM(:offence:) AS total, " +
		" areas.lat, areas.lng FROM offences" + 
		" INNER JOIN areas ON offences.area=areas.area";
		var params = 0;
		
		// Offences
		if (req.query.area !== undefined)
		{
			areas = filter(req.query.area);
			query = query.concat(" WHERE offences.area IN (:area)");
			params++;
		}

		// Age
		if (req.query.age !== undefined)
		{
			ages = filter(req.query.age);
			if (params === 0){
				query = query.concat(" WHERE age IN (:age)");
			} else {
				query = query.concat(" AND age IN (:age)");
			}
			params++;
		}

		// Year
		if (req.query.year !== undefined)
		{
			years = filter(req.query.year);
			if (params === 0){
				query = query.concat(" WHERE year IN (:year)");
			} 
			
			else 
			{
				query = query.concat(" AND year IN (:year)");
			}
			params++
		}

		// Month
		if (req.query.month !== undefined)
		{
			months = filter(req.query.month);
			if (params === 0)
			{
				query = query.concat(" WHERE month IN (:month)");
			} 
			
			else 
			{
				query = query.concat(" AND month IN (:month)");
			}
			params++
		}

		// Gender
		if (req.query.gender !== undefined)
		{
			genders = filter(req.query.gender);
			if (params === 0)
			{
				query = query.concat(" WHERE gender IN (:gender)");
			} 
			
			else 
			{
				query = query.concat(" AND gender IN (:gender)");
			}
		}
		
		query = query.concat(" GROUP BY LGA, lat, lng");
		
		req.db.raw(query, {
			offence: resp[0][0].column,
			area: areas,
			age: ages,
			year: years,
			month: months,
			gender: genders
		})
		.then((rows) => {
		res.status(200).json({
			"query": {
				"offence": req.query.offence,
				"area": req.query.area,
				"age": req.query.age,
				"year": req.query.year,
				"month": req.query.month,
				"gender": req.query.gender
			},
			"result": rows[0]})
		})
	})
	.catch((err) => {
		res.status(500).json({
			error: "oh no! It looks like there was a database error while performing" +
			" your search, give it another try..."
		})
	})
});

module.exports = router;
