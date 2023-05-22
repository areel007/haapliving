const Apartment = require("../models/apartment.model");
const cloudinary = require("../utils/cloudinary");

exports.createApartment = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const { title, description, location, price } = req.body;
    const newApartment = new Apartment({
      title,
      description,
      location,
      price,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    await newApartment.save();

    res.status(201).json({
      status: "success",
      newApartment,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

exports.getApartments = async (req, res) => {
  const apartments = await Apartment.find();

  res.status(200).json({
    status: "success",
    apartments,
  });
};

exports.getApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    res.status(200).json({
      status: "success",
      apartment,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    await cloudinary.uploader.destroy(apartment.cloudinaryId);
    await Apartment.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: "successful",
      apartment,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

exports.suggestedApartment = async (req, res) => {
  try {
    const apartments = await Apartment.find().limit(4).exec();
    res.status(200).json({
      status: "success",
      apartments,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
