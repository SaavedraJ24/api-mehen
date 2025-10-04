const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conexion exitosa a MongoDB Atlas");
    } catch (error) {
        console.error("Error al conectar a MongoDB Atlas:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;