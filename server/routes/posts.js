const express = require("express");

const Post = require("../models/Post");
const utils = require("../config/utils");
const constants = require("../config/constants");
const {
	authMiddleware,
	identifyRouter,
	setRouteLocals,
} = require("../middleware");

const router = express.Router();
router.use(identifyRouter(constants.postsRouter));

// TODO: How we handling this one?
// GET / Post Detail
router.get("/detail/:id", setRouteLocals, async (req, res) => {
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

router.use(authMiddleware);

// GET / add-post
router.get("/add-post", setRouteLocals, async (req, res) => {
	try {
		res.render("admin/add-post");
	} catch (error) {
		console.error("Add Post Error", error);
	}
});

// POST / add-post
router.post("/add-post", async (req, res) => {
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
router.get("/edit-post/:id", setRouteLocals, async (req, res) => {
	try {
		const data = await Post.findOne({ _id: req.params.id });
		res.render("admin/edit-post", {
			data,
		});
	} catch (error) {
		console.error("View Edit Post Error: ", error);
	}
});

// PUT / edit-post
router.put("/edit-post/:id", async (req, res) => {
	try {
		const postId = req.params.id;
		const { title, body } = req.body;
		await Post.findByIdAndUpdate(postId, {
			title,
			body,
			updatedAt: Date.now(),
		});
		res.redirect(`/posts/edit-post/${postId}`);
	} catch (error) {
		console.error("Editing Post Error", error);
	}
});

// DELETE / delete-post
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
	try {
		const postId = req.params.id;
		await Post.deleteOne({ _id: postId });
		res.redirect("/admin/dashboard");
	} catch (error) {
		console.error("Delete Post Error: ", error);
	}
});

module.exports = router;
