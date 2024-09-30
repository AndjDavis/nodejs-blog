const express = require("express");

// create a new instance of an Express Router object.
const router = express.Router();

router.get("", (req, res) => {
	const locals = {
		title: "NodeJS Blog",
		description: "Simple blog created with NodeJS, Express, & MongoDB",
	};

	res.render("index", { locals });
});

router.get("/about", (req, res) => {
	const locals = {
		title: "About",
		description: "About the NodeJS Blog",
	};
	res.render("about", { locals });
});

router.get("/contact", (req, res) => {
    const locals = {
        title: "Contact",
        description: "Contact the company"
    }
    res.render("contact", { locals })
})

module.exports = router;
