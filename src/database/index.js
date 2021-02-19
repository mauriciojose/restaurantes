const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/restaurantes', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;