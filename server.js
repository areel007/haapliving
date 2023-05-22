const mongoose = require('mongoose');
require('dotenv').config({path: "./config.env"})

const app = require("./app")

const DB = process.env.DATABASE;

mongoose.set("strictQuery", false);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((con) => {
    console.log("DB connection succesful");
  });

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App running on port ${port}`));
