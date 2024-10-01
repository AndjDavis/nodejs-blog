const express = require("express");

const Post = require("../models/Post");
const User = require("../models/User");
const { authMiddleware } = require("../middleware");

const router = express.Router();

const adminLayout = "../views/layouts/admin";

// GET / Post Detail
router.get("/post/:id", async (req, res) => {
	try {
		const slug = req.params.id;
		const data = await Post.findById({ _id: slug });
		const locals = {
			title: data.title,
			description: "Blog Post Details",
		};
		res.render("post", { locals, data });
	} catch (error) {
		console.error("Post Details Error: ", error);
	}
});

// GET / add-post
router.get("/add-post", authMiddleware, async (req, res) => {
    const locals = {
        title: "Add Post"
    }

    try {
        res.render("admin/add-post", { layout: adminLayout })
    } catch (error) {
        console.error("Add Post Error", error)
    }
})

module.exports = router;
