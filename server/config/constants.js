const adminLayout = "../views/layouts/admin";
const mainLayout = "./layouts/main";
const localsTitleMap = {
	"/": "Log In",
	"/register": "Register",
	"/dashboard": "Dashboard",
	"/add-post": "Add Post",
	"/edit-post/:id": "Edit Post",
};

module.exports.adminLayout = adminLayout;
module.exports.localsTitleMap = localsTitleMap;
module.exports.mainLayout = mainLayout;
