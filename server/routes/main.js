const express = require("express");
const Post = require("../models/Post");
const constants = require("../config/constants");
const { identifyRouter, setRouteLocals } = require("../middleware");

const router = express.Router(); // create a new instance of an Express Router object.
router.use(identifyRouter(constants.mainRouter));

// TODO: Copy pagination to dashboard, (create post list template)
// GET / Home
router.get("/", setRouteLocals, async (req, res) => {
	try {
		const postsPerPage = 10;
		const currentPage = req.query.page || 1;

		const data = await Post.getPaginatedPosts(currentPage, postsPerPage);
		const { posts, page, nextPageDisplay } = data;

		res.render("index", {
			posts,
			current: page,
			nextPage: nextPageDisplay,
		});
	} catch (error) {
		throw new Error(error);
	}
});

// POST / SEARCH
router.post("/search", setRouteLocals, async (req, res) => {
	try {
		const searchTerm = req.body?.searchTerm || "";
		const cleanedSearchTerm = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
		const data = await Post.find({
			$text: { $search: cleanedSearchTerm },
		});

		res.render("search-results", { data });
	} catch (error) {
		console.error("Searching Error: ", err);
	}
});

// GET / About
router.get("/about", setRouteLocals, (req, res) => {
	res.render("about");
});

// GET / Contact
router.get("/contact", setRouteLocals, (req, res) => {
	res.render("contact");
});

module.exports = router;
