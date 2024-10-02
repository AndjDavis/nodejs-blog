const express = require("express");
const bcrypt = require("bcrypt");

const Post = require("../models/Post");
const User = require("../models/User");
const {
	authMiddleware,
	generateJwtAndSetCookie,
	setAdminLocals,
} = require("../middleware");

const router = express.Router();

// GET / Admin
router.get("/", setAdminLocals, (req, res) => {
	try {
		res.render("admin/index");
	} catch (err) {
		console.error("Admin Error: ", err);
	}
});

// POST / Admin - Login
router.post(
	"/login",
	async (req, res, next) => {
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

			req.userId = user._id;
			next();
		} catch (err) {
			console.error("Login Error: ", err);
		}
	},
	generateJwtAndSetCookie
);

// GET / Register
router.get("/register", setAdminLocals, (req, res) => {
	try {
		res.render("admin/register");
	} catch (error) {
		console.error("Registration Error: ", error);
	}
});

// POST / Register
router.post(
	"/register",
	async (req, res, next) => {
		try {
			const { username, password } = req.body;
			const hashedPassword = await bcrypt.hash(password, 10);

			try {
				const user = await User.create({ username, password: hashedPassword });
				req.userId = user._id;
				next();
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
	},
	generateJwtAndSetCookie
);

// GET / Dashboard
router.get("/dashboard", authMiddleware, setAdminLocals, async (req, res) => {
	try {
		const data = await Post.find();
		res.render("admin/dashboard", { data });
	} catch (error) {
		console.error("Dashboard Error: ", error);
	}
});

// GET / Admin Logout
router.get("/logout", (req, res) => {
	res.clearCookie();
	req.session.destroy(); // Destroy the session
	res.redirect("/");
});

module.exports = router;
