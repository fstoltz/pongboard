var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mysql = require('mysql');
var secret = require('C:\\Users\\fstoltz\\Resources\\gitRepos\\pongboard\\secret.js');

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

app.engine('pug', require('pug').__express)
app.set("view engine", "pug");
app.set("views", secret.viewspath);


function insert(name, score){
	var con = mysql.createConnection({
		host: secret.host,
		user: secret.user,
		password: secret.password,
		database: "ponglogs"
	});

	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		var sql = "INSERT INTO scoreboard (name, score) VALUES ('"+name+"', '"+score+"')";
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log("1 record inserted");
		});
	});
}


app.post('/update', function(req, res, next){
	console.log(req.body);
	var con = mysql.createConnection({
		host: secret.host,
		user: secret.user,
		password: secret.password,
		database: "ponglogs"
	});


	con.connect(function(err) {
		if (err) throw err;
				var sql = "UPDATE scoreboard SET score = '"+req.body.score+"' WHERE name = '"+req.body.name+"'";
				con.query(sql, function (err, result) {
					if (err) throw err;
					console.log(result.affectedRows + " record(s) updated");
					if(result.affectedRows == 0){
						insert(req.body.name, req.body.score);
					}	    	
	  			});
	});
	res.redirect('/');
});


app.get('/update', function (req, res) {
	res.render('update');
	res.sendFile(secret.updatehtmlfilepath);
});


app.get('/', function (req, res) {
	var con = mysql.createConnection({
		host: secret.host,
		user: secret.user,
		password: secret.password,
		database: "ponglogs"
	});
	var arr = [];
	con.connect(function(err) {
	  if (err) throw err; 
	  con.query("SELECT * FROM scoreboard ORDER BY name ASC", function (err, result, fields) {
	    if (err) throw err;
			Object.keys(result).forEach(function(key) {
				var row = result[key];
	  			console.log(row.name)
	  			arr.push((row.name +" - "+row.score))
		    });
		 	res.render('homepage', {scorelist: arr});
	  });
	});
});



app.listen(8080)