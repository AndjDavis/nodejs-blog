const adminLayout = "../views/layouts/admin";
const mainLayout = "./layouts/main";
const mainRouter = "main";
const adminRouter = "admin";
const postsRouter = "posts";

const localsTitleMap = {
	[mainRouter]: {
		"/search": "Search Results",
		"/about": "About",
		"/contact": "Contact",
	},
	[adminRouter]: {
		"/": "Log In",
		"/dashboard": "Dashboard",
		"/register": "Register",
	},
	[postsRouter]: {
		"/add-post": "Add Post",
		"/edit-post/:id": "Edit Post",
	},
};

module.exports.adminLayout = adminLayout;
module.exports.localsTitleMap = localsTitleMap;
module.exports.mainLayout = mainLayout;
module.exports.mainRouter = mainRouter;
module.exports.adminRouter = adminRouter;
module.exports.postsRouter = postsRouter;
