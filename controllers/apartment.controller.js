const Apartment = require("../models/apartment.model");
const cloudinary = require("../utils/cloudinary");

exports.createApartment = async (req, res) => {
  try {
    const images = [];
    const options = {
      folder: "haapliving/apartments",
      resource_type: "auto",
    };

    // Upload multiple images to Cloudinary
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, options);
      images.push({
        image: result.secure_url,
        cloudinaryId: result.public_id,
      });
    }

    const {
      title,
      description,
      location,
      price,
      category,
      noBedroom,
      noBathroom,
    } = req.body;

    const newApartment = new Apartment({
      title,
      description,
      location,
      price,
      category,
      noBedroom,
      noBathroom,
      images, // Save the array of images
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
    apartment.images.map(async (image) =>
      cloudinary.uploader.destroy(image.cloudinaryId)
    );

    // await cloudinary.uploader.destroy(imagePublicId);
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

// exports.deleteApartment = async (req, res) => {
//   const apartmentId = req.params.id;

//   try {
//     // Retrieve apartment including image public IDs from MongoDB
//     const apartment = await Apartment.findById(apartmentId);
//     const imagePublicIds = apartment.images.map(image => image.publicId);

//     // Delete images from Cloudinary
//     await Promise.all(
//       imagePublicIds.map(async publicId => {
//         try {
//           const deleteResult = await cloudinary1.api.delete_resources([publicId]);
//           console.log(`Deleted image with public ID: ${publicId}`, deleteResult);
//         } catch (error) {
//           console.error(`Failed to delete image with public ID: ${publicId}`, error);
//         }
//       })
//     );

//     // Remove apartment from MongoDB
//     await Apartment.findByIdAndDelete(apartmentId);

//     res.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred during deletion.', detailedError: error.message });
//   }
// }

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

exports.searchApartment = async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      category,
      minBedroom,
      maxBedroom,
      minBathroom,
      maxBathroom,
    } = req.body;
    const filter = {};

    if (location) {
      filter.location = location;
    }

    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice) {
      filter.price = { $lte: maxPrice };
    }

    if (category) {
      filter.category = category;
    }

    if (minBedroom && maxBedroom) {
      filter.noBedroom = { $gte: minBedroom, $lte: maxBedroom };
    } else if (minBedroom) {
      filter.noBedroom = { $gte: minBedroom };
    } else if (maxBedroom) {
      filter.noBedroom = { $lte: maxBedroom };
    }

    if (minBathroom && maxBathroom) {
      filter.noBathroom = { $gte: minBathroom, $lte: maxBathroom };
    } else if (minBathroom) {
      filter.noBathroom = { $gte: minBathroom };
    } else if (maxBathroom) {
      filter.noBathroom = { $lte: maxBathroom };
    }

    const apartments = await Apartment.find(filter);

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
