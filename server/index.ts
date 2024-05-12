let mysql = require('mysql2/promise');
let express = require('express');
const { v4: uuidv4 } = require('uuid');
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


app.get('/getTasks', async function (req: any, res: any) {
    const group_id = req.query.group;
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
    try {
        const result = await con.query(`SELECT * FROM tasks WHERE idgroups=${group_id} AND completed=0 ORDER BY task_id ASC`);
        const json_output = Object.values(JSON.parse(JSON.stringify(result[0])));
        res.status(200).send(json_output);
    } catch (err) {
        console.log("ERROR => " + err);
        res.status(500); // internal server error
    } finally {
        con.end();
    }
});

// A function for when a task is completed
app.post('/completedTask', async function (req:any, res:any) {
    const task_id = req.query.task;
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
    try {
        const result = await con.query(`UPDATE tasks SET completed=1 WHERE task_id=${task_id}`);
        console.log(result);
        res.status(200).send(result);
    }
    catch (err) {
        console.log("ERROR => " + err);
        res.status(500); // internal server error
    }
    finally {
        con.end();
    }
});

app.post('/addTask', async function (req: any, res: any) {
    const task_name = req.query.name;
    const idgroup = req.query.group;
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
    try {
        const result = await con.query(`INSERT INTO tasks (task_name, idgroups) VALUES ("${task_name}", ${idgroup})`);
        console.log(result);
        res.status(200).send(result);
    }
    catch (err) {
        console.log("ERROR => " + err);
        res.status(500); // internal server error
    }
    finally {
        con.end();
    }
});

// Announcements Subsection
app.get('/getAnnouncements', async function (req: any, res: any){
    const group_id = req.query.group;
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
    try {
        const result = await con.query(`SELECT * FROM announcements WHERE idgroups=${group_id} ORDER BY announcements_id DESC`);
        const json_output = Object.values(JSON.parse(JSON.stringify(result[0])));
        res.status(200).send(json_output);
    } catch (err) {
        console.log("ERROR => " + err);
        res.status(200);
    }
    finally {
        con.end();
    }
});

// Group login section
app.post("/groupLogin", async function (req: any, res: any) {
    const body: {groupName: string, groupPass: string} = JSON.parse(req.body);
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
    try {
        const result = await con.query(`SELECT * FROM groups WHERE group_name="${body.groupName}" AND group_password="${body.groupPass}"`);
        if(result.length != 0) {
            // Successful login
            const json_output: {idgroups: BigInteger, group_name: string, group_password: string}[] = Object.values(JSON.parse(JSON.stringify(result[0])));
            console.log("Successful login!");
            res.status(200).send({
                successful: true,
                groupID: json_output[0].idgroups,
            });
        }
        else {
            // Failed login attempt
            console.log("Failed attempt!");
            res.status(200).send(JSON.stringify({
                successful: false
            }));
        }
    } catch (err) {
        console.log("ERROR => " + err);
        res.status(200).send({
            successful: false
        })
    }
    finally {
        con.end();
    }
});

// Individual login section
app.post("/login", async function (req: any, res: any) {
    const body: {username: string, password: string} = JSON.parse(req.body);
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
    try {
        const result = await con.query(`SELECT session_id FROM users WHERE username="${body.username}" AND password="${body.password}"`);
        if(result.length != 0) {
            // Successful Login
            const json_output: {session_id: string}[] = Object.values(JSON.parse(JSON.stringify(result)));
            console.log(json_output);
            res.send({
                successful: true,
                session_id: json_output[0].session_id
            });
        }
        else {
            res.send({
                successful: false
            })
        }
    }
    catch (err) {
        console.log("ERROR => " + err);
        res.status(200).send({
            successful: false,
        })
    }
    finally {
        con.end();
    }
});

app.get("/userInfo", async function (req: any, res: any) {
    const sessionID = req.query.session_id;
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
    try {
        const result = await con.query(`SELECT first_name, last_name, idgroups FROM users WHERE session_id="${sessionID}"`);
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
        }
        else {
            res.send({
                successful: false
            })
        }
    }
    catch (err) {
        console.log("ERROR => " + err);
        res.status(200).send({
            successful: false,
        })
    }
    finally {
        con.end();
    }
});

async function checkUsernameInUse(username: string): Promise<Boolean> {
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true})
    try {
        const query = `SELECT * FROM users WHERE username="${username}"`;
        const rows = await con.query(query);
        if(rows[0].length == 0) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (err) {
        console.log("ERROR => " + err);
        return true; // Username is in use
    }
    finally {
        con.end();
    }
}

// Signup user
app.post("/signup", async function (req: any, res: any) {
    const body: {firstName: string, lastName: string, username: string, password: string, groupId: string} = JSON.parse(req.body);
    const usernameChecked = await checkUsernameInUse(body.username);
    if(usernameChecked == false) {
        let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true})
        const sessionID = uuidv4();
        try {
            const query = `INSERT INTO users (idgroups, first_name, last_name, username, password, session_id) VALUES (${body.groupId}, "${body.firstName}", "${body.lastName}", "${body.username}", "${body.password}", "${sessionID}")`;
            const rows = await con.query(query);
            res.status(200).send({
                successful: true,
                sessionID: sessionID
            })
        }
        catch(err) {
            console.log("Error => " + err);
            res.status(200).send({
                successful: false,
                reason: "Unknown" // Need to make this debug message a bit better. For now it is good
            })
        }
        finally {
            con.end();
        }
    }
    else {
        res.status(200).send({
            successful: false,
            reason: "Username already in use!",
        })
    }
});

// Start Listening
app.listen(3000);