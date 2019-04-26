const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const port = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true}, (err) => {
    if(!err) {
        console.log("MongoDB Connection Found")
    } else {
        console.log("Error, Could Not Successfully Connect : " + err);
    }
});

//PASSPORT CONFIGURATION
 // EXPRESS SESSION
 app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
 // PASSPORT INIT
 app.use(passport.initialize());
 app.use(passport.session());
//passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//CURRENT USER
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
}); 

//REQUIRING ROUTES
const indexRoutes = require("./routes/index");
const laptopRoutes = require("./routes/laptop");

//Using Routes
app.use("/", indexRoutes);
app.use("/laptops", laptopRoutes);

//LISTEN PORT
app.listen(port, function(){
    console.log("ready captain")
});