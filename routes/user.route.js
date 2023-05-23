const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

// create a admin - add admin data
router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/verify").post(userController.verify);
router.route("/forgot").post(userController.forgotPassword);
router.route("/reset").post(userController.resetPassword);
router.route("/:id").get(userController.getUser);

module.exports = router;
