const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const port = 3000;

//SCHEMA
const laptopSchema = new mongoose.Schema({
    brand: String,
    image: [String],
    name: String,
    original: {type: Number},
    savings: {type: Number},
    price: {type: Number}
});

const Laptop = mongoose.model("Laptop", laptopSchema); 


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

//LAPTOPS
app.get("/laptops", function(req, res){
    res.render("laptop");
})

//FAQ
app.get("/faq", function(req, res){
    res.render("faq");
})

//ABOUT
app.get("/about", function(req, res){
    res.render("about");
})

// POST ROUTE
app.post("/", function(req, res){
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
})


//LAPTOP FORM
app.get("/new", function(req, res){
    res.render("new");
});

//LAPTOP 
app.get("/laptops/:id", function(req, res){
    Laptop.findById(req.params.id, function(err,laptop){
        if(err){
            console.log(err);
        } else {
            res.render("laptop", {laptop: laptop});
        }
    })
});

//LAPTOP EDIT
app.get("/laptops/:id/edit", function(req, res){
    Laptop.findById(req.params.id, function(err,foundLaptop){
        if(err){
            console.log("Error: " + err );
            res.redirect("/");
        } else {
            res.render("edit", {laptop: foundLaptop});
        }
    });
});

//LAPTOP UPDATE
app.put("/laptops/:id", function(req, res){
    Laptop.findOneAndUpdate(req.params.id, req.body.laptop, function(err, updatedLaptop){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/laptops/" + req.params.id);
        }
    });
});

//LISTEN PORT
app.listen(port, function(){
    console.log("ready captain")
});