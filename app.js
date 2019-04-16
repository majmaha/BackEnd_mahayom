//Load our project using express...
const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
var login = require('./routes/loginroutes');
var register = require('./routes/loginroutes');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');


//logging requests and stuff
app.use(morgan('short'))

//parsing incoming requests from json objects
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//allow origin, allow cross domain connections 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var router = express.Router();

app.get("/events/:id", (req,res) => {
    console.log("fetching even with id:" + req.params.id)
    const queryString = "SELECT * FROM events WHERE id= ?"
    const eventId = req.params.id

    //creating a connection constant
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password : 'toor1234',
        database : 'mahayomdb'
    })

    //execute query using connection , return err#500 if failed and log error
    connection.query( queryString,[eventId] ,(err,rows,feilds)=>{
        if(err){
            console.log("failed to retrieve events:"+err)
            res.sendStatus(500)
            res.end()
        }

        //custom formatting the returned json object, mapping json names to new values
        const events = rows.map((row) => {
            return {ID: row.id,event_name : row.eventName, even_category: row.eventCategory}
        })

        //response with object and log
        console.log("i think we got dem events")
        res.json(events)
    })
    //res.end()
})

//response for root route
app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("MaHayom API")
})

//return all events
app.get("/events", (req,res) => {
    var event1 = {eventName:"Karate",eventCategory:"Adult, Sport "}
    const event2 = {eventName:"LegoRobotics",eventCategory:"Kids,Scince"}
    res.json([event1,event2])
    //res.send("nodemon auto updates when i save this files")
})

//route to handle user registration
router.post('/register',login.register);
router.post('/login',login.login)
app.use('/api', router);

//run server on port 3003, use localhost:3003 to open the server.
//node app.js , starts the server from console
app.listen(3003, () => {
    console.log("server is up and runnng on port 3003")
})