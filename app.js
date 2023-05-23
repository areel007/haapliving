const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const upload = require("./utils/multer");

const userRoute = require("./routes/user.route");
const apartmentRoute = require("./routes/apartment.route");

const app = express();

// Middlewares
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

// routes
app.use("/api/v1/auth", upload.single("userImageUrl"), userRoute);
app.use("/api/v1/apartment", upload.single("imageUrl"), apartmentRoute);

module.exports = app;
