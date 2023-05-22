const express = require('express');
const app = express();
const { Employee } = require('./models/employee')
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000

const client = new MongoClient(URL);
client.connect(err => {
    if (err) { console.error(err); return false; }
    // connection to mongo is successful, listen for requests
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//middleware for  method override
app.use(methodOverride('_method'));

//middleware for express session
app.use(session({
    secret: "nodejs",
    resave: true,
    saveUninitialized: true
}));

//middleware for connect flash
app.use(flash());

//Setting messages variables globally
app.use((req, res, next) => {
    res.locals.success_msg = req.flash(('success_msg'));
    res.locals.error_msg = req.flash(('error_msg'));
    next();
});

app.get('/', (req, res) => {
    Employee.find({})
        .then(employees => {
            res.render('index', { employees: employees });
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: ' + err)
            res.redirect('/');
        })

});

app.get('/employee/new', (req, res) => {
    res.render('new');
});

app.get('/employee/search', (req, res) => {
    res.render('search', { employee: "" });
});

app.get('/employee', (req, res) => {
    let searchQuery = { name: req.query.name };

    Employee.findOne(searchQuery)
        .then(employee => {
            res.render('search', { employee: employee });
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: ' + err)
            res.redirect('/');
        });

});

app.get('/edit/:id', (req, res) => {

    let searchQuery = { _id: req.params.id };
    Employee.findOne(searchQuery)
        .then(employee => {
            res.render('edit', { employee: employee });
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: ' + err)
            res.redirect('/');
        });

});

app.post('/employee/new', (req, res) => {
    let newEmployee = {
        name: req.body.name,
        designation: req.body.designation,
        salary: req.body.salary
    };

    Employee.create(newEmployee)
        .then(employee => {
            req.flash('success_msg', 'Employee data added to database successfully.')
            res.redirect('/');
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: ' + err)
            res.redirect('/');
        });
});

app.put('/edit/:id', (req, res) => {
    let searchQuery = { _id: req.params.id };

    Employee.updateOne(searchQuery, {
        $set: {
            name: req.body.name,
            designation: req.body.designation,
            salary: req.body.salary
        }
    })
        .then(employee => {
            req.flash('success_msg', 'Employee data updated successfully.')
            res.redirect('/');
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: ' + err)
            res.redirect('/');
        });
});

app.delete('/delete/:id', (req, res) => {
    let searchQuery = { _id: req.params.id };

    Employee.deleteOne(searchQuery)
        .then(employee => {
            req.flash('success_msg', 'Employee deleted successfully.')
            res.redirect('/');
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: ' + err)
            res.redirect('/');
        });
});

