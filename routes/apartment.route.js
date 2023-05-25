const express = require("express");
const router = express.Router();

const apartmentController = require("../controllers/apartment.controller");

// create a new apartment
router.route("/add").post(apartmentController.createApartment);
router.route("/").get(apartmentController.getApartments);
router.route("/suggested").get(apartmentController.suggestedApartment);
router.route("/search-apartments").get(apartmentController.searchApartment);
router
  .route("/:id")
  .delete(apartmentController.deleteApartment)
  .get(apartmentController.getApartment);

module.exports = router;
