let mysql = require('mysql');
let express = require('express');
let app = express();

// Credentials file format:
/* {
    "host":"HOST_IP",
    "user":"DATABASE_USER",
    "password":"DATABASE_PASSWORD",
    "port": "DATABASE_PORT",
    "database": "DATABASE_NAME"
} */
const credentials = require('./mysqlCreds.json'); // Credentials file ommited from github for security reasons

// Tasks Subsection
app.get('/getTasks', function (req: any, res: any) {
    const group_id = req.query.group;
    let con = mysql.createConnection(credentials);
    con.connect(function(err: any) {
        if (err) throw err;
        // Ordered ascending to show the oldest tasks first
        con.query(`SELECT * FROM tasks WHERE idgroups=${group_id} AND completed=0 ORDER BY task_id ASC`, function (err: any, result: any, fields: any) {
          if (err) throw err;
          const json_output = Object.values(JSON.parse(JSON.stringify(result)));
          res.status(200).send(json_output);
          con.end();
        });
    });
});

// A function for when a task is completed
app.post('/completedTask', function (req:any, res:any) {
    const task_id = req.query.task;
    let con = mysql.createConnection(credentials);
    con.connect(function(err: any) {
        if (err) throw err;
        // Makes the data set to complete, DOES NOT DELETE IT. The data can still be recovered later using this method
        con.query(`UPDATE tasks SET completed=1 WHERE task_id=${task_id}`, function (err: any, result: any, fields: any) {
            if (err) throw err;
            console.log(result);
            res.status(200).send(result);
            con.end();
        });
    });
});

app.post('/addTask', function (req: any, res: any) {
    const task_name = req.query.name;
    const idgroup = req.query.group;
    let con = mysql.createConnection(credentials);
    con.connect(function(err: any) {
        if (err) throw err;
        con.query(`INSERT INTO tasks (task_name, idgroups) VALUES ("${task_name}", ${idgroup})`, function (err: any, result: any, fields: any) {
            if (err) throw err;
            console.log(result);
            res.status(200).send(result);
            con.end();
        });
    });
});

// Announcements Subsection
app.get('/getAnnouncements', function (req: any, res: any){
    const group_id = req.query.group;
    let con = mysql.createConnection(credentials);
    con.connect(function(err: any) {
        if (err) throw err;
        // Outputted descending to show the latest announcements at the top.
        con.query(`SELECT * FROM announcements WHERE idgroups=${group_id} ORDER BY announcements_id DESC`, function (err: any, result: any, fields: any) {
            if (err) throw err;
            const json_output = Object.values(JSON.parse(JSON.stringify(result)));
            res.status(200).send(json_output);
            con.end();
        });
    });
});

// Start Listening
app.listen(3000);