const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
var cookieParser = require('cookie-parser');

const session = require("express-session")
const Laptop = require("./models/laptops");
const User = require("./models/user");
const port = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride('_method'));
mongoose.connect("mongodb://localhost:27017/pcstore", {useNewUrlParser: true}, (err) => {
    if(!err) {
        console.log("MongoDB Connection Found")
    } else {
        console.log("Error, Could Not Successfully Connect : " + err);
    }
});

//PASSPORT CONFIGURATION
 // PASSPORT INIT
 app.use(passport.initialize());
 app.use(passport.session());
 // EXPRESS SESSION
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
//passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 

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