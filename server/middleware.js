const jwt = require("jsonwebtoken");
const constants = require("./config/constants");
const utils = require("./config/utils");

const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
	if (req.session.userId) {
		res.locals.isLoggedIn = true;
		next();
	} else {
		res.redirect("/admin");
	}
};

const generateJwtAndSetCookie = (req, res, next) => {
	req.session.userId = req.userId;
	const token = jwt.sign({ userId: req.userId }, jwtSecret);
	res.cookie("token", token, { httpOnly: true });
	res.redirect("/admin/dashboard");
};

const identifyRouter = (routerName) => {
	return (req, res, next) => {
		req.routerName = routerName;
		next();
	};
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
	else return res.redirect("/admin/dashboard");
};

const setRouteLocals = (req, res, next) => {
	const routerName = req.routerName;
	const useAdminLayout = utils.useAdminLayout(routerName);
	const titleKey = req?.route?.path || "";
	const title = constants.localsTitleMap[routerName][titleKey];

	if (useAdminLayout) {
		res.locals.layout = constants.adminLayout;
	}
	if (title) {
		res.locals.title = title;
	}

	res.locals.isLoggedIn = !!req?.session?.userId;
	res.locals.currentRoute = req.originalUrl;
	next();
};

module.exports = {
	authMiddleware,
	generateJwtAndSetCookie,
	identifyRouter,
	logger,
	redirectIfLoggedIn,
	setRouteLocals,
};
