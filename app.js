const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const nodeMailer = require("nodemailer");
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
    res.render("laptops");
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
            console.log(updatedLaptop);
        }
    });
});

//LAPTOP DESTROY
app.delete("/laptops/:id", function(req, res){
    Laptop.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});

//CONTACT
app.get("/contact",function(req, res){
    res.render("contact");
})

app.post("/contact",function(req,res){
    let mailOpts, smtpTrans;
    smtpTrans = nodeMailer.createTransport({
        host: changeThisLater,
        port: changeThisLater,
        secure: true;
        auth: {
            user: changeThisLater,
            pass: changeThisLater
        }
    });
    mailOpts = {
        from: req.body.name + ' &lt;' + req.body.email + '&gt;',
        to: changeThisLater,
        subject: "New message from contact form at Linhs PC Store"
        text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    };
    smtpTrans.sendMail(mailOpts, function(err, res){
        if(err){
            res.render("contact-failure");
        } else {
            res.render("contact-success");
        }
    })
});

//PURCHASE
app.get("/purchase",function(req, res){
    res.render("purchase");
})
//MANAGER LOGIN
app.get("/login",function(req, res){
    res.render("login");
})

//LISTEN PORT
app.listen(port, function(){
    console.log("ready captain")
});