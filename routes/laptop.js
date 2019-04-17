const express = require("express");
const router = express.Router();
const Laptop = require("../models/laptops");


//LAPTOPS: Shows Every Laptop
router.get("/", function(req, res){
    res.render("laptops");
})


//LAPTOP: Individual Laptops 
router.get("/:id", function(req, res){
    Laptop.findById(req.params.id, function(err,laptop){
        if(err){
            console.log(err);
        } else {
            res.render("laptop", {laptop: laptop});
        }
    })
});

//PURCHASE
router.get("/:id/purchase",function(req, res){
    Laptop.findById(req.params.id, function(err,laptop){
        if(err){
            console.log(err);
        } else {
            res.render("purchase", {laptop: laptop});
        }
    })
});


//LAPTOP CREATION FORM
router.get("/new", function(req, res){
    res.render("new");
});

//LAPTOP EDIT
router.get("/laptops/:id/edit", function(req, res){
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
router.put("/laptops/:id", function(req, res){
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
router.delete("/:id", function(req, res){
    Laptop.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});

module.exports = router;