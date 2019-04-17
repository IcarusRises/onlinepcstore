const express = require("express");
const router = express.Router();
const nodeMailer = require("nodemailer");
const Laptop = require("../models/laptops");

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

//MANAGER LOGIN
router.get("/login",function(req, res){
    res.render("login");
});


module.exports = router;