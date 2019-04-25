const express = require("express");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");
const nodeMailer = require("nodemailer");
const Laptop = require("../models/laptops");
const User = require("../models/user");
const userMiddleware = require("../middleware/index");


// HOME PAGE
router.get("/",function(req, res){
    Laptop.find({}, function(err, allLaptops){
        if(err){
            console.log("ERROR");
            console.log(err);
        } else {
            res.render("homepage", {laptops : allLaptops})
        }
    })
});

//USER REGISTRATION

//REGISTRATION FORM
router.get("/registernewuser", function(req, res){
    res.render("registration");
});

// REGISTER USER
router.post('/registernewuser', function(req, res){
    var password = req.body.password;
    var password2 = req.body.password2;
  
    if (password == password2){
      const newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
  
      userMiddleware.createUser(newUser, function(err, user){
        if(err) throw err;
        res.redirect("/");
      });
    } else{
      res.status(500).send("{errors: \"Passwords don't match\"}").end()
    }
  });

//USING LOCAL STRATEGY WITH PASSPORT
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(username, password, done) {
    userMiddleware.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Unknown User'});
      }
      userMiddleware.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
     	if(isMatch){
     	  return done(null, user);
     	} else {
     	  return done(null, false, {message: 'Invalid password'});
     	}
     });
   });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
});

//LOGIN
router.get("/login", function(req, res){
  res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function(req, res){
});
// LOGOUT
router.get('/logout', function(req, res){
  req.logout();
  res.redirect("login");
});

// POST ROUTE
router.post("/", function(req, res){
    let brand = req.body.brand;
    let image = req.body.image;   
    let name = req.body.name;
    let original = req.body.original;
    let savings = req.body.savings;
    let price = req.body.price;
    let newLaptops = { brand: brand, image: image, name: name, original: original, savings: savings, price: price};
    Laptop.create(newLaptops, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//FAQ
router.get("/faq", function(req, res){
    res.render("faq");
});

//ABOUT
router.get("/about", function(req, res){
    res.render("about");
});

//CONTACT
router.get("/contact",function(req, res){
    res.render("contact");
});

router.post("/contact",function(req,res){
    let mailOpts, smtpTrans;
    smtpTrans = nodeMailer.createTransport({
        host: changeThisLater,
        port: changeThisLater,
        secure: true,
        auth: {
            user: changeThisLater,
            pass: changeThisLater
        }
    });
    mailOpts = {
        from: req.body.name + ' &lt;' + req.body.email + '&gt;',
        to: changeThisLater,
        subject: "New message from contact form at Linhs PC Store",
        text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    };
    smtpTrans.sendMail(mailOpts, function(err, res){
        if(err){
            res.render("contact-failure");
        } else {
            res.render("contact-success");
        }
    });
});

module.exports = router;