const logger = (req, res, next) => {
	try {
		
		const logTime = new Date(Date.now()).toISOString();
		const params = req?.params || "";
		res.on("finish", () => {
			console.log(`${logTime}: ${req.method}|${res.statusCode}|${req.path}/${params}`)
		})
	} catch (error) {
		console.error("Logging Error: ", error)
	} finally {
		next();
	}
};

module.exports = logger;
