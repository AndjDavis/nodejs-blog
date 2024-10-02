const constants = require("./constants");

const getLayout = (referer) => {
	const isAdmin = referer && referer.endsWith("/admin/dashboard");
	return isAdmin ? constants.adminLayout : constants.mainLayout;
};

const getBackRoute = (referer) => {
	const isAdmin = referer && referer.endsWith("/admin/dashboard");
	console.log("Get Back Route", isAdmin);
	return isAdmin ? "/admin/dashboard" : "/";
};

module.exports.getLayout = getLayout;
module.exports.getBackRoute = getBackRoute;
