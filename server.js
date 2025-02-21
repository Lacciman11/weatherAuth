const app = require("./app");
require("dotenv").config();
const connectDB = require("./src/config/dbConfig");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start the server
const startServer = async () => {
  try {
    await connectDB(); // ✅ Ensures database connection before starting server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer(); // ✅ Call the function to start the server
