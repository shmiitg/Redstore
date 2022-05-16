require("dotenv").config();
const mongoose = require("mongoose");

let url = process.env.MONGO_DB;

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true, wtimeoutMS: 2500 })
    .then(() => console.log("Database connected..."))
    .catch((err) => console.log("Error: ", err));
