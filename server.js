require("dotenv").config(); // Load .env variables first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes"); // Adjust filename as per your actual file

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB using env variable
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Mount task routes
app.use("/api/tasks", taskRoutes);

// Start server on port from .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
