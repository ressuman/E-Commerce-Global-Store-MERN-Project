import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING_URL)
  .then(() => {
    console.log("Successfully connected to MongoDB Database👍🔥");
  })
  .catch((err) => {
    console.error("Initial MongoDB connection error:", err.message);
  });

// Connection state
const db = mongoose.connection;

// Check DB Connection
db.on("connected", () => {
  console.log("DB Connection Successful!");
});

db.on("error", (err) => {
  console.log("DB Connection failed!", err.message);
});

db.on("disconnected", () => {
  console.log("DB Connection disconnected!");
});

// Gracefully close the connection when the app is closed
process.on("SIGINT", async () => {
  try {
    await db.close();
    console.log("DB Connection closed due to application termination.");
    process.exit(0);
  } catch (err) {
    console.error("Error closing DB connection:", err.message);
    process.exit(1);
  }
});

export default db;
