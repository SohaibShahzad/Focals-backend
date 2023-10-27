const mongoose = require("mongoose");

// Connection URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://Admin-Sohaib:futureDBfocals@futurefocalscluster0.xhujfx1.mongodb.net/futurefocalsDB";
  // process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/futurefocalsDB";
  // process.env.MONGODB_URI || "mongodb://Admin-Sohaib:futureDBfocals@ac-mhnjsb5-shard-00-00.xhujfx1.mongodb.net:27017,ac-mhnjsb5-shard-00-01.xhujfx1.mongodb.net:27017,ac-mhnjsb5-shard-00-02.xhujfx1.mongodb.net:27017/futurefocalsDB?replicaSet=atlas-flro2s-shard-0&ssl=true&authSource=admin"

// Connect to MongoDB
async function connectDB () {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
