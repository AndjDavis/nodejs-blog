const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

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

const authMiddleware = (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const decoded = jwt.verify(token, jwtSecret);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		res.status(401).json({ message: "Unauthorized" });
	}
};

module.exports = {
	authMiddleware,
	logger,
};
