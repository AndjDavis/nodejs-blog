const getPaginatedPosts = async function (page, perPage) {
	const results = {};

	try {
		const skipAmount = perPage * (page - 1);
		const posts = await this.aggregate([{ $sort: { createdAt: -1 } }])
			.skip(skipAmount)
			.limit(perPage)
			.exec();

		const count = await this.countDocuments();
		const nextPage = parseInt(page) + 1;
		const numberOfPages = Math.ceil(count / perPage);
		const hasNextPage = nextPage <= numberOfPages;
		const nextPageDisplay = hasNextPage ? nextPage : null;
		results.count = count;
		results.nextPageDisplay = nextPageDisplay;
		results.numberOfPages = numberOfPages;
		results.page = page;
		results.posts = posts;
	} catch (error) {
		console.error("Get Paginated Posts Error: ", error);
	}

	return results;
};

module.exports.getPaginatedPosts = getPaginatedPosts;
