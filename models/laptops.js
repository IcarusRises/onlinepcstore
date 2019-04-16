const mongoose = require("mongoose");

const laptopSchema = new mongoose.Schema({
    brand: String,
    image: [String],
    name: String,
    original: {type: Number},
    savings: {type: Number},
    price: {type: Number}
});

module.exports = mongoose.model("Laptop", laptopSchema); 