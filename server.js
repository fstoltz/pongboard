var express = require('express')
var app = express()

var bodyParser = require('body-parser');

var mysql = require('mysql');


app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

app.engine('pug', require('pug').__express)
app.set("view engine", "pug");
app.set("views", "C:\\Users\\fstoltz\\Resources\\gitRepos\\pongboard\\views");



function insert(name, score){

	var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nacka17",
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
	//res.json(req.body);

	var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nacka17",
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
	//res.send("You submitted: <br><br>Name: "+req.body.name+"<br>Score: "+req.body.score);
});


//app.get('/', function (req, res) {
//	res.sendFile("C:\\Users\\fstoltz\\Resources\\gitRepos\\pongboard\\index.html");
//});


app.get('/update', function (req, res) {
	res.render('update');
	res.sendFile("C:\\Users\\fstoltz\\Resources\\gitRepos\\pongboard\\update.html");
});


app.get('/', function (req, res) {


	var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nacka17",
  database: "ponglogs"
});

	var arr = [];
	//arr.push({
	//	key:"kee",
	//	value: "vale"
	//});

	con.connect(function(err) {
	  if (err) throw err; 
	  con.query("SELECT * FROM scoreboard ORDER BY name ASC", function (err, result, fields) {
	    if (err) throw err;
			//arr.push([0]);
			//arr.pop();
			//res.send(arr);
			Object.keys(result).forEach(function(key) {
     		 var row = result[key];
      			console.log(row.name)
      			arr.push((row.name + " - " +row.score))
    });
			 	res.render('homepage', {myVar: arr});
 		
		  });
	});


	//var string = getTableData();
	//console.log(string);
	
});

var dict = []; // create an empty array

dict.push({
    key:   "keyName",
    value: "the value"
});
// repeat this last part as needed to add more key/value pairs

app.get('/sandbox', function (req, res) {
  res.render('homepage',
  { title : 'foqke?' }
  )
})




app.listen(8080, () => console.log('Example app listening on port 8080!'))