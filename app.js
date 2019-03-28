const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;

//SCHEMA
const laptopSchema = new mongoose.Schema({
    image: String,
    name: String,
    original: Number,
    savings: Number,
    price: Number
});

const Laptop = mongoose.model("Laptop", laptopSchema); 

// Laptop.create({
//     image: 'img/PC/probook.jpg',
//     name: 'HP ProBook 450 G3',
//     original: "469.99",
//     savings: "170",
//     price: "399.99"
// }, function(err, laptop){
//     if(err){
//         console.log(err);
//         console.log("ERROR");
//     } else {
//         console.log("SUCCESS");
//         console.log(laptop)
//     }
// });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/pcstore",{useNewUrlParser: true});


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
    let image = req.body.image;   
    let name = req.body.name;
    let original = req.body.original;
    let savings = req.body.savings;
    let price = req.body.price;
    let newLaptops = { image: image, name: name, original: original, savings: savings, price: price};
    Laptop.create(newLaptops, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
    res.redirect("/");
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