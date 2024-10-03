const express = require("express");
const bcrypt = require("bcrypt");

const Post = require("../models/Post");
const User = require("../models/User");
const constants = require("../config/constants");
const {
	authMiddleware,
	generateJwtAndSetCookie,
	identifyRouter,
	redirectIfLoggedIn,
	setRouteLocals,
} = require("../middleware");

const router = express.Router();
router.use(identifyRouter(constants.adminRouter));

// GET / Admin
router.get("/", redirectIfLoggedIn, setRouteLocals, (req, res) => {
	try {
		res.render("admin/index");
	} catch (err) {
		console.error("Admin Error: ", err);
	}
});

// POST / Admin - Login
router.post(
	"/login",
	redirectIfLoggedIn,
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
router.get("/register", redirectIfLoggedIn, setRouteLocals, (req, res) => {
	try {
		res.render("admin/register");
	} catch (error) {
		console.error("Registration Error: ", error);
	}
});

// POST / Register
router.post(
	"/register",
	redirectIfLoggedIn,
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

router.use(authMiddleware);

// GET / Dashboard
router.get("/dashboard", setRouteLocals, async (req, res) => {
	try {
		const data = await Post.find();
		res.render("admin/dashboard", { data });
	} catch (error) {
		console.error("Dashboard Error: ", error);
	}
});

// TODO: This isn't working.
// GET / Admin Logout
router.get("/logout", (req, res) => {
	res.clearCookie("token", { httpOnly: true });
	req.session.destroy((err) => {
		if (err) {
			console.error("Session destroy error: ", err);
			return res.status(500).send("Error occurred while logging out");
		} else {
			res.redirect("/");
		}
	}); // Destroy the session
});

module.exports = router;
