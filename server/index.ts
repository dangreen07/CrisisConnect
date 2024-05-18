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
    // Get the group id from the request query
    const sessionID = req.query.session_id;

    const userAuthenticated = await userAuth(sessionID);

    if(userAuthenticated)
    {
        const groupID = await getGroupID(sessionID);
        // Create a new MySQL connection pool
        let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
        try {
            // Query the tasks table for tasks belonging to the specified group and not completed
            const result = await con.query(`SELECT * FROM tasks WHERE idgroups=? AND completed=0 ORDER BY task_id ASC`, [groupID]);
    
            // Parse the result into JSON
            const json_output = Object.values(JSON.parse(JSON.stringify(result[0])));
    
            // Send the JSON result with a 200 status code
            res.status(200).send({successful: true, result: json_output});
        } catch (err) {
            // Log any errors
            console.log("ERROR => " + err);
    
            // Send a 500 status code for internal server error
            res.status(500).send({successful: false, reason: "Internal server error!"});
        } finally {
            // End the MySQL connection
            con.end();
        }
    }
    else
    {
        res.status(401).send({successful: false, reason: "sessionID invalid!"});
    }
});

app.post('/completedTask', async function (req:any, res:any) {
    const task_id = req.query.task;
    const sessionID = req.query.session_id;
    const userAuthenticated = await userAuth(sessionID);
    if(userAuthenticated)
    {
        let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
        try {
            const result = await con.query(`UPDATE tasks SET completed=1 WHERE task_id=?`, [task_id]);
            console.log(result[0]);
            res.status(200).send({successful: true, result: result[0]});
        }
        catch (err) {
            console.log("ERROR => " + err);
            // Internal server error
            res.status(500).send({successful: false, reason: "Internal server error!"});
        }
        finally {
            con.end();
        }
    }
    else {
        res.status(401).send({successful: false, reason: "sessionID invalid!"});
    }
});

app.post('/addTask', async function (req: any, res: any) {
    const task_name = req.query.name;
    const sessionID = req.query.session_id;
    const userAuthenticated = await userAuth(sessionID);

    if(userAuthenticated)
    {
        const idgroup = await getGroupID(sessionID);
        let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
        try {
            const result = await con.query(`INSERT INTO tasks (task_name, idgroups) VALUES (?, ?)`, [task_name, idgroup]);
            console.log(result[0]);
            res.status(200).send({successful: true, result: result[0]});
        }
        catch (err) {
            console.log("ERROR => " + err);
            // Internal server error
            res.status(500).send({successful: false, reason: "Internal server error!"});
        }
        finally {
            con.end();
        }
    }
    else {
        res.status(401).send({successful: false, reason: "sessionID invalid!"});
    }
});


app.get('/getAnnouncements', async function (req: any, res: any){
    const sessionID = req.query.session_id;
    const userAuthenticated = await userAuth(sessionID);

    if(userAuthenticated)
    {
        const group_id = await getGroupID(sessionID);
        let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
        try {
            const result = await con.query(`SELECT * FROM announcements WHERE idgroups=? ORDER BY announcements_id DESC`, [group_id]);
            const json_output = Object.values(JSON.parse(JSON.stringify(result[0])));
            res.status(200).send({successful: true, result: json_output});
        } catch (err) {
            console.log("ERROR => " + err);
            res.status(500).send({successful: false, reason: "Internal server error!"});
        }
        finally {
            con.end();
        }
    }
    else
    {
        res.status(401).send({successful: false, reason: "sessionID invalid!"});
    }
});

app.post("/groupLogin", async function (req: any, res: any) {
    const body: {groupName: string, groupPass: string} = JSON.parse(req.body);
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
    try {
        const result = await con.query(`SELECT idgroups, group_name, group_pasword FROM groups WHERE group_name=? AND group_password=?`, [body.groupName, body.groupPass]);
        if(result[0].length != 0) {
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
        const result = await con.query(`SELECT session_id FROM users WHERE username=? AND password=?`, [body.username, body.password]);
        if(result[0].length != 0) {
            // Successful Login
            const json_output: {session_id: string}[] = Object.values(JSON.parse(JSON.stringify(result[0])));
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
        const result = await con.query(`SELECT first_name, last_name, idgroups FROM users WHERE session_id=?`, [sessionID]);
        if(result[0].length != 0) {
            // Successful Login
            const json_output: {first_name: string, last_name: string, idgroups: string}[] = Object.values(JSON.parse(JSON.stringify(result[0])));
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
        // Username is in use
        return true; 
    }
    finally {
        con.end();
    }
}

app.post("/signup", async function (req: any, res: any) {
    const body: {firstName: string, lastName: string, username: string, password: string, groupId: string} = JSON.parse(req.body);
    const usernameChecked = await checkUsernameInUse(body.username);
    if(usernameChecked == false) {
        let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
        const sessionID = uuidv4();
        try {
            const query = `INSERT INTO users (idgroups, first_name, last_name, username, password, session_id) VALUES (?, ?, ?, ?, ?, ?)`;
            const rows = await con.query(query, [
                body.groupId,
                body.firstName,
                body.lastName,
                body.username,
                body.password,
                sessionID
            ]);
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

// The authentication function (Very important this is reliable)
async function userAuth(sessionID: string): Promise<Boolean> {
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
    try {
        const result = await con.query(`SELECT * FROM users WHERE session_id=?`, [sessionID]);
        if(result[0].length == 0) {
            // Failed authentication
            return false; 
        }
        else {
            // User authenticated
            return true; 
        }
    }
    catch (err) {
        console.log("Error => " + err);
        return false;
    }
    finally {
        con.end();
    }
}

async function getGroupID(sessionID: string) {
    let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
    try {
        const result = await con.query(`SELECT * FROM users WHERE session_id=?`, [sessionID]);
        const groupID = result[0][0]["idgroups"];
        return groupID;
    }
    catch (err) {
        console.log("Error => " + err);
        return 0;
    }
    finally {
        con.end();
    }
}

// Map system

app.post("/setRegion", async function (req: any, res: any) {
    // Will use sessionID for authentication (especially important here as modifying data for the entire group)
    const body: {
        sessionID: string,
        latitude: Number,
        longitude: Number,
        latitudeDelta: Number,
        longitudeDelta: Number
    } = JSON.parse(req.body);
    const userAuthenticated = await userAuth(body.sessionID);
    if (userAuthenticated) {
        let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
        try {
            const groupID = await getGroupID(body.sessionID);
            const result = await con.query(`UPDATE groups SET latitude=?,longitude=?,latitudeDelta=?,longitudeDelta=? WHERE idgroups=?`, [body.latitude, body.longitude, body.latitudeDelta, body.longitudeDelta, groupID]);
            res.status(200).send({
                successful: true
            });
        }
        catch (err) {
            res.status(500);
        }
        finally {
            con.end();
        }
    }
    else {
        // Failed authentication
        // 401 - Unauthorized
        res.status(401).send({successful: false, reason: "sessionID invalid!"});
    }
});

app.post("/getRegion", async function (req: any, res: any) {
    const body: {
        sessionID: string
    } = JSON.parse(req.body);
    const userAuthenticated = await userAuth(body.sessionID);
    if (userAuthenticated) {
        let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
        try {
            const groupID = await getGroupID(body.sessionID);
            const result = await con.query(`SELECT latitude, longitude, latitudeDelta, longitudeDelta FROM groups WHERE idgroups=?`, [groupID]);
            const json_output: {latitude: Number, longitude: Number, latitudeDelta: Number, longitudeDelta: Number}[] = Object.values(JSON.parse(JSON.stringify(result[0])));
            res.status(200).send({
                successful: true,
                latitude: json_output[0].latitude,
                longitude: json_output[0].longitude,
                latitudeDelta: json_output[0].latitudeDelta,
                longitudeDelta: json_output[0].longitudeDelta
            });
        }
        catch (err) {
            res.status(500).send({successful: false, reason: "Internal server error!"});
        }
        finally {
            con.end();
        }
    }
    else {
        // Failed authentication
        // 401 - Unauthorized
        res.status(401).send({successful: false, reason: "sessionID invalid!"});
    }
});

app.post("/addMarker", async function (req: any, res: any) {
    const body: {
        sessionID: string,
        latitude: number,
        longitude: number,
        title: string,
        description: string,
        iconSource: String,
        iconColor: String
    } = JSON.parse(req.body);
    const userAuthenticated = await userAuth(body.sessionID);
    if (userAuthenticated) {
        let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
        try {
            const groupID = await getGroupID(body.sessionID);
            const result = await con.query(`INSERT INTO map_locations (latitude, longitude, title, description, idgroups, icon_source, icon_color) VALUES (?, ?, ?, ?, ?, ?, ?)`, [body.latitude, body.longitude, body.title, body.description, groupID, body.iconSource, body.iconColor]);
            res.status(200).send({successful: true});
        }
        catch (err) {
            res.status(500).send({successful: false, reason: "Internal server error!"});
        }
        finally {
            con.end();
        }
    }
    else {
        // Failed authentication
        // 401 - Unauthorized
        res.status(401).send({successful: false, reason: "sessionID invalid!"});
    }
});

app.get("/getMarkers", async function (req: any, res: any) {
    const sessionID = req.query.session_id;
    const userAuthenticated = await userAuth(sessionID);
    if(userAuthenticated) {
        let con = mysql.createPool({...credentials, connectionLimit: 100, queueLimit: 0, waitForConnections: true});
        try {
            const groupID = await getGroupID(sessionID);
            const result = await con.query(`SELECT latitude, longitude, title, description, icon_source, icon_color FROM map_locations WHERE idgroups=?`, [groupID]);
            const json_output: {latitude: Number, longitude: Number, title: String, description: String, icon_source: String, icon_color: String}[] = Object.values(JSON.parse(JSON.stringify(result[0])));
            res.status(200).send({successful: true, results:json_output});
        }
        catch (err) {
            res.status(500).send({successful: false, reason: "Internal server error!"});
        }
        finally {
            con.end();
        }
    }
    else {
        // Failed authentication
        // 401 - Unauthorized
        res.status(401).send({successful: false, reason: "sessionID invalid!"});
    }
});

// Start Listening
app.listen(3000);