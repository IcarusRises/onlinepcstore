const middlewareExports = module.exports = {};
const bcrypt = require("bcryptjs");

//MIDDLEWARE
middlewareExports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  };

middlewareExports.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
  };
  
middlewareExports.getUserById = function(id, callback){
    User.findById(id, callback);
  };
  
middlewareExports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
    });
  };

middlewareExports.checkUserAuthorization = function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("login");
  };


