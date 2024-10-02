const express = require("express");

const Post = require("../models/Post");
const User = require("../models/User");
const { authMiddleware } = require("../middleware");

const router = express.Router();

const adminLayout = "../views/layouts/admin";

// GET / Post Detail
router.get("/detail/:id", async (req, res) => {
	try {
		const slug = req.params.id;
		const data = await Post.findById({ _id: slug });
		const locals = {
			title: data.title,
			description: "Blog Post Details",
		};

        const referer = req?.headers?.referer || null;
        const backRoute = utils.getBackRoute(referer);
        const layout = utils.getLayout(referer);

		res.render("post-detail", { locals, data, backRoute, layout: layout });
	} catch (error) {
		console.error("Post Details Error: ", error);
	}
});

// GET / add-post
router.get("/add-post", authMiddleware, async (req, res) => {
	const locals = {
		title: "Add Post",
	};

	try {
		res.render("admin/add-post", { locals, layout: adminLayout });
	} catch (error) {
		console.error("Add Post Error", error);
	}
});

// POST / add-post
router.post("/add-post", authMiddleware, async (req, res) => {
	try {
		const { title, body } = req.body;
		const newPost = new Post({
			title,
			body,
		});
		await Post.create(newPost);
		res.redirect("/admin/dashboard");
	} catch (error) {
		console.error("Add New Post Error", error);
	}
});

module.exports = router;
