const mysql = require('mysql')
var encrypt = require('../security/encrypt');
var bcrypt = require('bcrypt');


exports.register = function(req,res){
    // console.log("req",req.body);
    var today = new Date();
    var users={
      "first_name":req.body.first_name,
      "last_name":req.body.last_name,
      "email":req.body.email,
      "password":bcrypt.hashSync(req.body.password,10),
      "created":today,
      "modified":today
    }
        //creating a connection constant
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password : 'toor1234',
            database : 'mahayomdb'
        })

    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      console.log('The solution is: ', results);
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
    }
    });
  }

  exports.login = function(req,res){
    var email= req.body.email;
    var password = req.body.password;
        //creating a connection constant
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password : 'toor1234',
            database : 'mahayomdb'
        })
    connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      // console.log('The solution is: ', results);
      if(results.length >0){
        //if(results[0].password == password){
        if(bcrypt.compareSync(password,results[0].password)){
          res.send({
            "code":200,
            "success":"login sucessfull"
              });
        }
        else{
          res.send({
            "code":204,
            "success":"Email and password does not match"
              });
        }
      }
      else{
        res.send({
          "code":204,
          "success":"Email does not exits"
            });
      }
    }
    });
  }