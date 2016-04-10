var express = require('express');
var bodyParser = require('body-parser');
//var expressjwt = require("express-jwt");
var jwt = require("jsonwebtoken");


var app = express();

//app.use(expressjwt());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.set('',config.secret);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:/a2');

var db = mongoose.connection;
var employeeSchema = new mongoose.Schema({
    id: Number,
    guid: String,
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    salt: String,
    todo: [{
        id: Number,
        status: String,
        priority: String,
        date: Date,
        description: String
    }],
    
    messages: [{
        id: Number,
        contact: {
            firstname: String,
            lastname: String,
            university: {
                id: Number,
                name: String,
                address: String,
                city: String,
                state: String, 
                zip: Number,
                website: String,
                latitude: Number,
                longitude: Number
            }
        },
        date: String,
        category: String,
        content: String
    }],
    
    books: [{
        id: Number,
        isbn10: String,
        isbn13: Number,
        title: String,
        category: String
    }]
});


var Employee = mongoose.model("Employee", employeeSchema);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connected");
});

app.use(function(req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
    next(); 
    
});

/*
    routes for employee information
    DONE
*/
//route for dumping all employee data
app.route('/api/employees')
    .get(function(req, resp) {
        console.log("in dump route");
        Employee.find({}, function(err, data) {
            if (err) {
                console.log('error finding all employees');
                resp.json({ message: 'Unable to connect to employees database' });
            }
            else {
                // return found data as json back to request
                resp.json(data);
            }
        });
    });

//route for validating an employee's login credentials
app.route('/api/employees/login/:username')
    .post(function(req, resp) {
        console.log("in login credentials route");
        console.log(req.params.username + " - " + req.body.password);
        Employee.find(
            {username: req.params.username, password: req.body.password}, 
            {id: 1, username: 1}, 
            function(err, data) {
                if (err) {
                    console.log('error finding an employee with specified username and password');
                    resp.json({ message: 'Unable to validate employee' });
                }
                else {
                    // return found data as json back to request
                    // if returned empty then there is no user
                    console.log(data);
                    
                    var token = jwt.sign({username: req.params.username}, 'comp4513', {expiresIn: "20m"});
                    // var decoded = jwt.decode(token, {complete: true});
                    // console.log(decoded);
                    
                    //resp.cookie('authenticated', 'true', {secure: false, httpOnly: false, expires: new Date (Date.now() + (1000 * 60 * 20))});
                    //resp.cookie('authenticated', 'true', {Domain: "preview.c9users.io",Path: "/nobuhumi/web3-assignment2"});
                    //console.log(resp.cookies);
                    resp.json(token);
                    
                }
            }
        );
    });
    
    
//route for getting a single employee's data
//token is a jsonwebtoken that includes the employee's username when decoded
app.route('/api/employees/:token')
    .get(function(req, resp) {
        console.log("in filtered route");
        jwt.verify(req.params.token, 'comp4513', function (err, decoded) {
            if (err) {
                console.log("error obtaining dashboard data: " + err);
                resp.json({error: "error obtaining user data for dashboard"});
            }
            else {
                Employee.find({username: decoded.username}, function(err, data) {
                    if (err) {
                        console.log('error finding employee');
                        console.log(decoded);
                        resp.json({ error: 'Unable to connect to employee database' });
                    }
                    else {
                        // return found data as json back to request
                        resp.json(data);
                        console.log(data);
                    }
                });
            }
        });
        
    });
    
/*    
    route for getting book list information
    DONE
*/
//route for getting a single employee's book information
app.route('/api/employees/books/:id')
    .get(function(req, resp) {
        console.log("in booklist route");
        Employee.find({id: req.params.id}, {books: 1}, function(err, data) {
            if (err) {
                console.log('error finding booklist');
                resp.json({ message: 'Unable to retrieve employee\'s booklist' });
            }
            else {
                // return found data as json back to request
                resp.json(data[0].books);
            }
        });
    });
    
/*    
    routing for messages
    DONE
*/
//route for retireving an employee's messages
app.route('/api/employees/messages/:id')
    .get(function(req, resp) {
        console.log("in message retrieval route");
        Employee.find({id: req.params.id}, {messages: 1}, function(err, data) {
            if (err) {
                console.log('error finding messages');
                resp.json({ message: 'Unable to retrieve employee\'s messages' });
            }
            else {
                
                // return found data as json back to request
                resp.json(data[0].messages);
            }
        });
    })
    
//route for creating a message
//assumption: creating a message will store the message in the destination employee's message array
//            not the sending employee's array
//note: when testing in postman, key values must be in body and body must be in form-urlencoded
    .post(function(req, resp) {
        console.log("in sending route");
        // var newID = Employee.find({ id: req.params.id}, {messages: 1}).length;
        // resp.json();
        Employee.update(
            {id: req.params.id},
            {'$push':
                {"messages":
                  {
                      "id": req.body.id,
                      "date": req.body.date,
                      "category": req.body.category,
                      "content": req.body.content,
                      "contact": {
                          "firstname": req.params.contact.firstname,
                          "lastname": req.params.contact.lastname,
                          "university": {
                              "id": req.params.contact.university.id,
                              "name": req.params.contact.university.name,
                              "address": req.params.contact.university.address,
                              "city": req.params.contact.university.city,
                              "state": req.params.contact.university.state,
                              "website": req.params.contact.university.website,
                              "latitude": req.params.contact.university.latitude,
                              "longitude": req.params.contact.university.longitude
                          }
                      }
                  }
                }
            }, 
            function(err, data) {
                if (err) {
                    console.log('error inserting message');
                    resp.json({ message: 'Unable to send employee\'s message' });
                }
                else {
                    
                    resp.json({ message: 'Employee\'s message sent successfully' });
                    //console.log(req.body);
                }
            }
        );
    });
    
/*
    routing for the CRUD functionality of the to do list
    DONE(I think)
*/
//route for retrieval of to do list
//:id is the id of the employee, used to access their specific data
app.route('/api/employees/:id/todo/')
    .get(function(req, resp) {
        console.log("in to do list retrieval route");
        Employee.find({id: req.params.id}, {todo: 1}, function(err, data) {
            if (err) {
                console.log('error finding to do list');
                resp.json({ message: 'Unable to retrieve employee\'s to do list' });
            }
            else {
                // return found data as json back to request
                resp.json(data[0].todo);
            }
        });
    })

//route for creation of to do list item
    .post(function(req, resp) {
        console.log("in to do list item creation route");
        Employee.update(
            {id: req.params.id},
            {'$push': {
                    "todo": {
                        "id": req.body.id,
                        "status": req.body.status,
                        "priority": req.body.priority,
                        "date": req.body.date,
                        "description": req.body.description
                    }
                }
            },
            function(err, data) {
                if (err) {
                    console.log('error finding to do list');
                    resp.json({ message: 'Unable to create to do list item' });
                }
                else {
                    
                    resp.json({ message: "to do item sucessfully created"});
                }
            }
        );
    });

//route for updating a to do list item
//assumption: date of to do list items is the day they were created and cannot be changed
app.route('/api/employees/:id/todo/:todoID')
    .put(function(req, resp) {
        console.log("in to do list update route");
        Employee.update(
            {id: req.params.id, 'todo.id': req.params.todoID}, 
            {
                '$set': {
                    'todo.$.status': req.body.status,
                    'todo.$.priority': req.body.priority,
                    'todo.$.description': req.body.description
                }
            }, 
            function(err, data) {
                if (err) {
                    console.log('error updating to do list');
                    resp.json({ message: 'Unable to update employee\'s to do list item' });
                }
                else {
                    //resp.json(data);
                    resp.json({ message: "successfully updated the to do list item"});
                }
            }
        );
    })

//route for deleting a to do list item
    .delete(function(req, resp) {
        console.log("in to do list delete route");
        Employee.update(
            {id: req.params.id}, 
            {'$pull': {todo: {id: req.params.todoID}}}, 
            function(err, data) {
                if (err) {
                    console.log('error deleting to do list item');
                    resp.json({ message: 'Unable to delete specified to do list item' });
                    //resp.json(err);
                }
                else {
                    
                    resp.json({ message: "successfully deleted the to do list item"});
                }
            }
        );
    });

app.listen(process.env.PORT, process.env.IP);