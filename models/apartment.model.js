const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  category: {
    type: String,
  },
  noBedroom: {
    type: Number,
  },
  noBathroom: {
    type: Number
  }
});

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;
