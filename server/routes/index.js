var express = require('express');
var router = express.Router();

/* GET a list of types of offences */
router.get("/offences", function(req, res) 
{
	req.db.select("pretty").from('offence_columns')
	.then((rows) => 
	{
	  let ret = [];
		
		for (let i = 0; i < rows.length;i++)
		{
		  ret[i] = rows[i].pretty;
		}
		
	  res.status(200).json({"offences" : ret})
	})
});

/* GET a list of areas in the database */
router.get("/areas", function(req, res) 
{
	req.db.select("area").from('areas')
	.then((rows) => 
	{
	  let ret = [];
		
		for (let i = 0; i < rows.length;i++)
		{
		  ret[i] = rows[i].area;
	  }
		
		res.status(200).json({"areas" : ret})
	})
});

/* GET a list of years recorded in the database */
router.get("/years", function(req, res) 
{
	req.db.distinct("year").from('offences')
	.then((rows) => 
	{
	  let ret = [];
		for (let i = 0; i < rows.length;i++)
		{
		  ret[i] = rows[i].year;
		}
		
	  res.status(200).json({"years" : ret})
	})
});

/* GET a list of genders in the database */
router.get("/genders", function(req, res) 
{
	req.db.distinct("gender").from('offences')
	.then((rows) => 
	{
	  let ret = [];
		
		for (let i = 0; i < rows.length;i++)
		{
		  ret[i] = rows[i].gender;
	  }
		
		res.status(200).json({"genders" : ret})
	})
});

/* GET a list of ages in the database */
router.get("/ages", function(req, res) 
{
	req.db.distinct("age").from('offences')
	.then((rows) => 
	{
	  let ret = [];
		
		for (let i = 0; i < rows.length;i++)
		{
		  ret[i] = rows[i].age;
	  }
		
		res.status(200).json({"ages" : ret})
	})
});

module.exports = router;
