const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		mongoose.set("strictQuery", false);
		const MONGODB_URI = process.env.MONGODB_URI || "";
		const conn = await mongoose.connect(MONGODB_URI);
        console.log(`Database Connected: ${conn.connection.host}`);
	} catch (err) {
		console.log("Database Error: ", err);
	}
};

module.exports = connectDB;
