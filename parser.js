require("dotenv").config();
const Snoowrap = require("snoowrap");

const r = new Snoowrap({
	userAgent: "reddit-bot-example-node",
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS,
});

r.getSubreddit("nbastreams")
	.getHot()
	.then(res => {
		console.log(res);
	});
