let mysql = require('mysql');
let express = require('express');
require('dotenv').config();
let app = express();

app.use(express.raw({ type: '*/*', limit: '10mb' })); // Allows for recieving raw body data

const credentials = {
    "host": process.env.DATABASE_HOST || "http://localhost",
    "user": process.env.DATABASE_USER || "root",
    "password": process.env.DATABASE_PASSWORD || "password",
    "port": process.env.DATABASE_PORT || 3306,
    "database": process.env.DATABASE_NAME || "crisisconnect",
}


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

// Group login section
app.post("/groupLogin", function (req: any, res: any) {
    const body: {groupName: string, groupPass: string} = JSON.parse(req.body);
    let con = mysql.createConnection(credentials);
    con.connect(function(err: any) {
        if (err) throw err;
        con.query(`SELECT * FROM groups WHERE group_name="${body.groupName}" AND group_password="${body.groupPass}"`, function (err: any, result: any, fields: any)
        {
            if (err) throw err;
            if(result.length != 0) {
                // Successful login
                const json_output: {idgroups: BigInteger, group_name: string, group_password: string}[] = Object.values(JSON.parse(JSON.stringify(result)));
                console.log("Successful login!");
                res.status(200).send({
                    successful: true,
                    groupID: json_output[0].idgroups,
                });
                con.end();
            }
            else {
                // Failed login attempt
                console.log("Failed attempt!");
                res.status(200).send(JSON.stringify({
                    successful: false
                }));
                con.end();
            }
        });
    });
});

// Individual login section
app.post("/login", function (req: any, res: any) {
    const body: {username: string, password: string} = JSON.parse(req.body);
    console.log(body);
    let con = mysql.createConnection(credentials);
    con.connect(function(err: any) {
        if (err) throw err;
        con.query(`SELECT session_id FROM users WHERE username="${body.username}" AND password="${body.password}"`, function (err: any, result: any, fields: any)
        {
            if (err) throw err;
            if(result.length != 0) {
                // Successful Login
                const json_output: {session_id: string}[] = Object.values(JSON.parse(JSON.stringify(result)));
                console.log(json_output);
                res.send({
                    successful: true,
                    session_id: json_output[0].session_id
                });
                con.end();
            }
            else {
                res.send({
                    successful: false
                })
                con.end();
            }
        });
    });
});

app.get("/userInfo", function (req: any, res: any) {
    const sessionID = req.query.session_id;
    console.log(sessionID);
    let con = mysql.createConnection(credentials);
    con.connect(function(err: any) {
        if (err) throw err;
        con.query(`SELECT first_name, last_name, idgroups FROM users WHERE session_id="${sessionID}"`, function (err: any, result: any, fields: any) {
            if (err) throw err;
            if(result.length != 0) {
                // Successful Login
                const json_output: {first_name: string, last_name: string, idgroups: string}[] = Object.values(JSON.parse(JSON.stringify(result)));
                console.log(json_output);
                res.send({
                    successful: true,
                    first_name: json_output[0].first_name,
                    last_name: json_output[0].last_name,
                    group_id: json_output[0].idgroups
                });
                con.end();
            }
            else {
                res.send({
                    successful: false
                })
                con.end();
            }
        });
    });
});

// Start Listening
app.listen(3000);