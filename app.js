require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./server/config/db");
const { logger } = require("./server/middleware");
const constants = require("./server/config/constants");
const utils = require("./server/config/utils");

// Create the express application
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Add public directory
app.use(express.static("public"));

// Templating Engine
app.set("view engine", "ejs");
app.use(expressLayout);
app.set("layout", constants.mainLayout);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
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
app.use("/posts", require("./server/routes/posts"));

// Default locals values
app.locals.isActiveRoute = utils.isActiveRoute;
app.locals.description = "Simple blog created with NodeJS, Express, & MongoDB";
app.locals.title = "NodeJS Blog";

// Listen on PORT
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
