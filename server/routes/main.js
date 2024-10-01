const express = require("express");
const Post = require("../models/Post");

const router = express.Router(); // create a new instance of an Express Router object.

// GET / Home
router.get("/", async (req, res) => {
	try {
		let perPage = 10;
		let page = req.query.page || 1;
		const skipAmount = perPage * page - perPage;
		const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
			.skip(skipAmount)
			.limit(perPage)
			.exec();

		const count = await Post.countDocuments();
		const nextPage = parseInt(page) + 1;
		const numberOfPages = Math.ceil(count / perPage);
		const hasNextPage = nextPage <= numberOfPages;
		const nextPageDisplay = hasNextPage ? nextPage : null;

		res.render("index", {
			data,
			current: page,
			nextPage: nextPageDisplay,
		});
	} catch (error) {
		throw new Error(error);
	}
});

// GET / Home (Basic)
// router.get("", async (req, res) => {
// 	const locals = {
// 		title: "NodeJS Blog",
// 		description: "Simple blog created with NodeJS, Express, & MongoDB",
// 	};
// 	try {
// 		const data = await Post.find();
// 		const nextPage = null;
// 		res.render("index", { locals, data, nextPage });
// 	} catch (err) {
// 		console.log("Database Error: ", err)
// 	}
// });

// GET / POSTS/_id
// router.get("/posts/:id", async (req, res) => {
// 	try {
// 		const slug = req.params.id;
// 		const data = await Post.findById({ _id: slug });
// 		const locals = {
// 			title: data.title,
// 			description: "Blog Post Details",
// 		};
// 		res.render("post", { locals, data });
// 	} catch (error) {
// 		console.log("Database Error: ", err);
// 	}
// });

// POST / SEARCH
router.post("/search", async (req, res) => {
	try {
		const searchTerm = req.body?.searchTerm || "";
		const cleanedSearchTerm = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
		const data = await Post.find({
			$text: { $search: cleanedSearchTerm },
		});

		const locals = {
			title: "Search Results",
		};
		res.render("search-results", { data, locals });
	} catch (error) {
		console.log("Searching Error: ", err);
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

// Add post data to the database
// function insertPostData(posts) {
// 	Post.insertMany(
// 		posts
// 	)
// }

// const postData = [
// 		{
// 			title: "A Look at the Future of Nodejs",
// 			body: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		},
// 		{
// 			title: "Building APIs with Node.js",
// 			body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js",
// 		},
// 		{
// 			title: "Deployment of Node.js applications",
// 			body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments...",
// 		},
// 		{
// 			title: "Authentication and Authorization in Node.js",
// 			body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries.",
// 		},
// 		{
// 			title: "Understand how to work with MongoDB and Mongoose",
// 			body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications.",
// 		},
// 		{
// 			title: "build real-time, event-driven applications in Node.js",
// 			body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js.",
// 		},
// 		{
// 			title: "Discover how to use Express.js",
// 			body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications.",
// 		},
// 		{
// 			title: "Asynchronous Programming with Node.js",
// 			body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations.",
// 		},
// 		{
// 			title: "Learn the basics of Node.js and its architecture",
// 			body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers.",
// 		},
// 		{
// 			title: "NodeJs Limiting Network Traffic",
// 			body: "Learn how to limit netowrk traffic.",
// 		},
// 		{
// 			title: "Learn Morgan - HTTP Request logger for NodeJs",
// 			body: "Learn Morgan.",
// 		},
// 	]

// insertPostData();

module.exports = router;
