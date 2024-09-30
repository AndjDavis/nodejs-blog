require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");

// create the express application
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");



// use as homepage
app.use("/", require("./server/routes/main"));

// Listen on PORT
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
