const express = require("express");
const app = express();
const bodyParser = require("body-parser");
let laptops = [
    {image: "img/PC/probook.jpg", name: 'HP ProBook 450 G3', orignal: "469.99", savings:"170", price: "399.99"},
    {image: "img/PC/probook.jpg", name: 'HP ProBook 450 G2', orignal: "479.99", savings:"50", price: "599.99"},
    {image: "img/PC/probook.jpg", name: 'HP ProBook 450 G4', orignal: "569.99", savings:"60", price: "650.00"},
    {image: "img/PC/probook.jpg", name: 'HP ProBook 450 G5', orignal: "499.99", savings:"85", price: "469.99"}
]
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));


// HOME PAGE
app.get("/", function(req, res){
    res.render("homepage", {laptops : laptops});
})

app.get("/laptops", function(req, res){
    res.render("laptop");
})

app.get("/faq", function(req, res){
    res.render("faq");
})

// POST ROUTE
app.post("/", function(req, res){
    let image = req.body.image;   
    let name = req.body.name;
    let original = req.body.original;
    let savings = req.body.savings;
    let price = req.body.price;
    let newLaptops = { image: image, name: name, original: original, savings: savings, price: price};
    laptops.push(newLaptops);
    res.redirect("/");
})


//LAPTOP FORM
app.get("/new", function(req, res){
    res.render("new");
});


//LISTEN PORT
app.listen(port, function(){
    console.log("ready captain")
});