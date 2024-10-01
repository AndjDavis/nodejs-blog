require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./server/config/db");
const logger = require("./server/middleware");

// Create the express application
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Add public directory
app.use(express.static("public"));

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI,
		}),
		// cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
	})
);
app.use(logger);

// Routes
app.use("/", require("./server/routes/main"));
app.use("/admin", require("./server/routes/admin"));

// Default locals values
app.locals.title = "NodeJS Blog";
app.locals.description = "Simple blog created with NodeJS, Express, & MongoDB";

// Listen on PORT
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
