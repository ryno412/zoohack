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

var reportSchema = new mongoose.Schema({
    // phone number of participant
    bird: String,
    color: String,
});

var userSchema = new mongoose.Schema({
    name: String,
    phone: {unique: true, type: String},
    age: { type: Number, min: 0},
    chatPrompt: String,
    reports: [reportSchema]
});

// userSchema.updateLastChat = (lastQues, cb)=>{
//
// }


var User = mongoose.model('Users', userSchema);
var Report = mongoose.model('Report', reportSchema);

// Clear out old data
User.remove({}, function(err) {
    if (err) {
        console.log ('error deleting old data.');
    }
});

// Creating one user.
var johndoe = new User ({
    name: 'John',
    age: 25,
    phone:'76088899999',
    reports: [],

});

function up (user, x){
    user.age = 11
    user.save(err =>{
        console.log(err);
    })
}
johndoe.save(err =>{
    console.log(err, 'SAVING')
    User.findOne({
        phone: `76088899999`,
    }, function(err, user) {
        console.log('USER', user);
        up(user)


    });
})

module.exports = {
    User,
    Report
}