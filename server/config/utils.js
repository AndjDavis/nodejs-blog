const constants = require("./constants");

const getBackRoute = (referer) => {
	const isAdmin = referer && referer.endsWith("/admin/dashboard");
	return isAdmin ? "/admin/dashboard" : "/";
};

const getLayout = (referer) => {
	const isAdmin = referer && referer.endsWith("/admin/dashboard");
	return isAdmin ? constants.adminLayout : constants.mainLayout;
};

const isActiveRoute = (route, currentRoute) =>
	route === currentRoute ? "active" : "";

const useAdminLayout = (routerName) => {
	const isAdminRouter = routerName === constants.adminRouter;
	const isPostsRouter = routerName === constants.postsRouter;
	return !!(isAdminRouter || isPostsRouter);
};

module.exports.getLayout = getLayout;
module.exports.getBackRoute = getBackRoute;
module.exports.isActiveRoute = isActiveRoute;
module.exports.useAdminLayout = useAdminLayout;
