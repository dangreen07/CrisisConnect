let mysql = require('mysql');

const credentials = require('./mysqlCreds.json');

let con = mysql.createConnection(credentials);
  
con.connect(function(err: any) {
    if (err) throw err;
    console.log("Connected!");
});