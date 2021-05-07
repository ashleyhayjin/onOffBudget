const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin-ashley:test123@cluster0.oy5oz.mongodb.net/budgetDB", {useNewUrlParser: true, useFindAndModify: false});

module.exports = mongoose.connection;