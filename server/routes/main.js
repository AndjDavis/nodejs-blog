const express = require("express");
const Post = require("../models/Post");

const router = express.Router(); // create a new instance of an Express Router object.

// TODO: Copy pagination to dashboard, (create post list template)
// GET / Home
router.get("/", async (req, res) => {
	try {
		let perPage = 10;
		let page = req.query.page || 1;
		const skipAmount = perPage * page - perPage;
		const posts = await Post.aggregate([{ $sort: { createdAt: -1 } }])
			.skip(skipAmount)
			.limit(perPage)
			.exec();

		const count = await Post.countDocuments();
		const nextPage = parseInt(page) + 1;
		const numberOfPages = Math.ceil(count / perPage);
		const hasNextPage = nextPage <= numberOfPages;
		const nextPageDisplay = hasNextPage ? nextPage : null;

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
router.post("/search", async (req, res) => {
	const locals = {
		title: "Search Results",
	};

	try {
		const searchTerm = req.body?.searchTerm || "";
		const cleanedSearchTerm = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
		const data = await Post.find({
			$text: { $search: cleanedSearchTerm },
		});

		res.render("search-results", { data, locals });
	} catch (error) {
		console.error("Searching Error: ", err);
	}
});

router.get("/about", (req, res) => {
	const locals = {
		title: "About",
	};
	res.render("about", { locals });
});

router.get("/contact", (req, res) => {
	const locals = {
		title: "Contact",
	};
	res.render("contact", { locals });
});

module.exports = router;
