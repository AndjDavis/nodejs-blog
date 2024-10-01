const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Post = require("../models/Post");
const User = require("../models/User");
const { authMiddleware } = require("../middleware");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();

const createTokenSetCookie = (req, res, userId) => {
	const token = jwt.sign({ userId: userId }, jwtSecret);
	res.cookie("token", token, { httpOnly: true });
	res.redirect("admin/dashboard");
};

// GET / Admin
router.get("/", (req, res) => {
	try {
		const locals = {
			title: "Admin",
			description: "Login",
		};

		res.render("admin/index", { locals, layout: adminLayout });
	} catch (err) {
		console.error("Admin Error: ", err);
	}
});

// POST / Admin - Login
router.post("/", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ message: "Invalid Credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid Credentials" });
		}

		createTokenSetCookie(req, res, user._id);
		// const token = jwt.sign({ userId: user._id }, jwtSecret);
		// res.cookie("token", token, { httpOnly: true });
		// res.redirect("admin/dashboard");
	} catch (err) {
		console.error("Login Error: ", err);
	}
});

// GET / Register
router.get("/register", (req, res) => {
	try {
		const locals = {
			title: "Register",
		};
		res.render("admin/register", { locals, layout: adminLayout });
	} catch (error) {
		console.error("Registration Error: ", error);
	}
});

// POST / Register
router.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		try {
			const user = await User.create({ username, password: hashedPassword });
			// res.status(201).json({ message: "User Created", user });
			createTokenSetCookie(req, res, user._id);
		} catch (error) {
			if (error.code === 11000) {
				res.status(409).json({ message: "User already in use..." });
			} else {
				res.status(500).json({ message: "Internal server error" });
			}
		}
	} catch (err) {
		console.error("Registration Error: ", err);
		res.status(500).json({ message: "Internal server error" }); // Send an error response here
	}
});

// GET / Dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
	try {
		const locals = {
			title: "Dashboard",
		};
		const data = await Post.find();
		res.render("admin/dashboard", { locals, data, layout: adminLayout });
	} catch (error) {
		console.error("Dashboard Error: ", error);
	}
});

module.exports = router;
