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

const isActiveRoute = (route, currentRoute) =>
	route === currentRoute ? "active" : "";

module.exports.getLayout = getLayout;
module.exports.getBackRoute = getBackRoute;
module.exports.isActiveRoute = isActiveRoute;
