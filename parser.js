require("dotenv").config();
const Snoowrap = require("snoowrap");

const r = new Snoowrap({
	userAgent: "reddit-bot-example-node",
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS,
});
const getLink = team => {
	r.getSubreddit("nbastreams")
		.getHot()
		.then(res => {
			res.forEach(item => {
				if (item.title)
			});

			const thread = res.find(item => item.title.includes(team)).id
			r.getSubmission(thread)
				.expandReplies({ limit: Infinity, depth: Infinity })
				.then(data => {
					const split = data.comments[0].body_html.split("href=");
					const link = split.find(item =>
						/http:\/\/ripple.is.*/.test(item),
					);
					console.log(link.split('"')[1]);
					// data.forEach(item => console.log(item));
				});
		});
}
