const jwt = require("jsonwebtoken");
const constants = require("./config/constants");

const jwtSecret = process.env.JWT_SECRET;

const generateJwtAndSetCookie = (req, res, next) => {
	req.session.userId = req.userId;
	const token = jwt.sign({ userId: req.userId }, jwtSecret);
	res.cookie("token", token, { httpOnly: true });
	res.redirect("/admin/dashboard");
};

const authMiddleware = (req, res, next) => {
	if (req.session.userId) {
		res.locals.isLoggedIn = true;
		next();
	} else {
		res.redirect("/admin");
	}
};

const logger = (req, res, next) => {
	try {
		const logTime = new Date(Date.now()).toISOString();
		const params = req?.params || "";
		res.on("finish", () => {
			console.log(
				`${logTime}: ${req.method}|${res.statusCode}|${req.path}/${params}`
			);
		});
	} catch (error) {
		console.error("Logging Error: ", error);
	} finally {
		next();
	}
};

const redirectIfLoggedIn = (req, res, next) => {
	if (!req?.session?.userId) next();
	return res.redirect("/admin/dashboard");
};

const setAdminLocals = (req, res, next) => {
	res.locals.layout = constants.adminLayout;
	const path = req?.route?.path || req?.path;
	res.locals.title = constants.localsTitleMap[path] || "Admin";
	next();
};

module.exports = {
	authMiddleware,
	generateJwtAndSetCookie,
	logger,
	redirectIfLoggedIn,
	setAdminLocals,
};
