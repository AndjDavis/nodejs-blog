const express = require("express");
const User = require("../models/User");
const router = express.Router();

const adminLayout = "../views/layouts/admin";

const locals = {
	title: "Admin",
};

// GET / Admin - Login
router.get("/", async (req, res) => {
	try {
		const locals = {
			title: "Admin",
			description: "Login",
		};
		const data = [];

		res.render("admin/index", { locals, data, layout: adminLayout });
	} catch (err) {
		console.log("Database Error: ", err);
	}
});

// GET / Admin - Check Login
router.post("/", async (req, res) => {
	const locals = {
		title: "Admin",
		description: "Login",
	};
	try {
		const { username, password } = req.body;
		console.log(req.body);

		res.render("admin/index", { locals, layout: adminLayout });
	} catch (err) {
		console.log("Database Error: ", err);
	}
});

// GET / Admin - Register
router.get("/register", async (req, res) => {
	try {
		const locals = {
			title: "Admin",
			description: "Register"
		};

		res.render("admin/register", { locals, layout: adminLayout });
	} catch (err) {
		console.log("Database Error: ", err);
	}
});

module.exports = router;
