const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;

//SCHEMA
const laptopSchema = new mongoose.Schema({
    brand: String,
    image: String,
    name: String,
    second: String,
    third: String,
    original: {type: Number},
    savings: {type: Number},
    price: {type: Number}
});

const Laptop = mongoose.model("Laptop", laptopSchema); 

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/pcstore", {useNewUrlParser: true}, (err) => {
    if(!err) {
        console.log("MongoDB Connection Found")
    } else {
        console.log("Error, Could Not Successfully Connect : " + err);
    }
});


// HOME PAGE
app.get("/",function(req, res){
    Laptop.find({}, function(err, allLaptops){
        if(err){
            console.log("ERROR");
            console.log(err);
        } else {
            res.render("homepage", {laptops : allLaptops})
        }
    })
})

app.get("/laptops", function(req, res){
    res.render("laptop");
})

app.get("/faq", function(req, res){
    res.render("faq");
})

app.get("/about", function(req, res){
    res.render("about");
})

// POST ROUTE
app.post("/", function(req, res){
    let brand = req.body.brand;
    let image = req.body.image;   
    let name = req.body.name;
    let second = req.body.second;
    let third = req.body.third;
    let original = req.body.original;
    let savings = req.body.savings;
    let price = req.body.price;
    let newLaptops = { brand: brand, image: image, name: name, second: second, third: third, original: original, savings: savings, price: price};
    Laptop.create(newLaptops, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
})


//LAPTOP FORM
app.get("/new", function(req, res){
    res.render("new");
});

app.get("/laptops/:id", function(req, res){
    Laptop.findById(req.params.id, function(err,laptop){
        if(err){
            console.log(err);
        } else {
            res.render("laptop", {laptop: laptop});
        }
    })
});

//LISTEN PORT
app.listen(port, function(){
    console.log("ready captain")
});