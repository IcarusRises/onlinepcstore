const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcryptjs');

//USER SCHEMA
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

//MIDDLEWARE
module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  };

  module.exports.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
  };
  
  module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
  };
  
  module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
    });
  };

  module.exports.checkUserAuthorization = function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("login");
  }