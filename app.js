const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const port = 3000;


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
mongoose.connect("mongodb://localhost:27017/pcstore", {useNewUrlParser: true}, (err) => {
    if(!err) {
        console.log("MongoDB Connection Found")
    } else {
        console.log("Error, Could Not Successfully Connect : " + err);
    }
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