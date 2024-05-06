let mysql = require('mysql');
let express = require('express');
let app = express();

const credentials = require('./mysqlCreds.json');

app.get('/getTasks', function (req: any, res: any) {
    const group_id = req.query.group;
    console.log(group_id);
    let con = mysql.createConnection(credentials);
    con.connect(function(err: any) {
        if (err) throw err;
        con.query(`SELECT * FROM tasks WHERE idgroups=${group_id} AND completed=0`, function (err: any, result: any, fields: any) {
          if (err) throw err;
          const json_output = Object.values(JSON.parse(JSON.stringify(result)));
          res.status(200).send(json_output);
          con.end();
        });
    });
});

app.post('/completedTask', function (req:any, res:any) {
    const task_id = req.query.task;
    let con = mysql.createConnection(credentials);
    con.connect(function(err: any) {
        if (err) throw err;
        con.query(`UPDATE tasks SET completed=1 WHERE task_id=${task_id}`, function (err: any, result: any, fields: any) {
            if (err) throw err;
            console.log(result);
            res.status(200).send(result);
            con.end();
        });
    });
});

app.listen(3000);