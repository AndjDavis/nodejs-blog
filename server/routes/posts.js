const express = require("express");

const Post = require("../models/Post");
const User = require("../models/User");
const { authMiddleware, setAdminLayout } = require("../middleware");
const utils = require("../config/utils");

const router = express.Router();

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
router.get("/add-post", authMiddleware, setAdminLayout, async (req, res) => {
	const locals = {
		title: "Add Post",
	};

	try {
		res.render("admin/add-post", { locals });
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

// GET / edit-post
router.get(
	"/edit-post/:id",
	authMiddleware,
	setAdminLayout,
	async (req, res) => {
		try {
			const locals = {
				title: "Edit Post",
			};

			const data = await Post.findOne({ _id: req.params.id });

			res.render("admin/edit-post", {
				locals,
				data,
			});
		} catch (error) {
			console.error("Edit Post Error: ", error);
		}
	}
);

// PUT / edit-post
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
	try {
		const post_id = req.params.id;
		const { title, body } = req.body;
		await Post.findByIdAndUpdate(post_id, {
			title,
			body,
			updatedAt: Date.now(),
		});
		res.redirect(`posts/edit-post/${req.params.id}`);
	} catch (error) {
		console.error("Add New Post Error", error);
	}
});

module.exports = router;
