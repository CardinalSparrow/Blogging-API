const dotenv = require("dotenv");
dotenv.config();
// require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const app = express();
const logger = require("./utils/logger");

const PORT = process.env.PORT;
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const connectDB = require("./config/db");
connectDB();
// const MONGO_URL = process.env.MONGO_URL;
app.use(express.json());

//routes

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// mongoose.set("strictQuery", false);
// mongoose
//   .connect(MONGO_URL)

//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(PORT, () => {
//       console.log(`API is running on ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });
