const express = require("express");
const router = express.Router();
const Laptop = require("../models/laptops");
const bodyParser = require("body-parser");

//LAPTOP CREATION FORM
router.get("/new", function(req, res){
    res.render("new");
});

//LAPTOPS: Shows Every Laptop
router.get("/", function(req, res){
    Laptop.find({}, function(err, allLaptops){
        if(err){
            console.log("ERROR");
            console.log(err);
        } else {
            res.render("laptops", {laptops : allLaptops})
        }
    });
});

//LAPTOPS SEARCH QUERY
router.get("/search", function(req,res){
    let noMatch = null;
    if(req.query.search){
        //Gets Laptop from MongoDB
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Laptop.find({ "name": regex }, function(err, foundLaptops) {
            if(err) {
                console.log(err);
            } else {
                if(foundLaptops.length < 1){
                    noMatch = `Sorry, Search could not find ${req.query.search}, please try again.`
                }
               res.render("search", { laptops: foundLaptops, noMatch: noMatch });
            }
        }); 
     } else {
        Laptop.find({}, function(err, allLaptops){
            if(err){
                console.log("ERROR");
                console.log(err);
            } else {
                res.render("laptops", {laptops : allLaptops, noMatch: noMatch})
            }
        });
     };
});

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




//LAPTOP EDIT
router.get("/:id/edit", function(req, res){
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
router.put("/:id", function(req, res){
    Laptop.findOneAndUpdate({_id: req.params.id}, req.body.laptop, function(err, updatedLaptop){
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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;