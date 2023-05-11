const mongoose = require('mongoose');

const employeeScheme = new mongoose.Schema({
    name : String,
    designation : String,
    salary : Number
});

const Employee = mongoose.model('Employee', employeeScheme);

exports.Employee = Employee;