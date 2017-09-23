var mongoose = require ("mongoose");
// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
    process.env.MONGODB_URI ||
    'mongodb://localhost';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 27017


// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});

var userSchema = new mongoose.Schema({
    name: {
        first: String,
        last: { type: String, trim: true }
    },
    age: { type: Number, min: 0}
});


var User = mongoose.model('Users', userSchema);

// Clear out old data
User.remove({}, function(err) {
    if (err) {
        console.log ('error deleting old data.');
    }
});

// Creating one user.
var johndoe = new User ({
    name: { first: 'John', last: 'Doe' },
    age: 25
});

// Saving it to the database.
johndoe.save(function (err) {if (err) console.log ('Error on save!')});

// Creating more users manually
var janedoe = new User ({
    name: { first: 'Jane', last: 'Doe' },
    age: 65
});

module.exports = User;