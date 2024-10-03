const mongoose = require("mongoose");
const { getPaginatedPosts } = require("./utils");

const Schema = mongoose.Schema;
const PostSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

PostSchema.index({ title: "text", body: "text" });
PostSchema.statics.getPaginatedPosts = getPaginatedPosts;

module.exports = mongoose.model("Post", PostSchema);
