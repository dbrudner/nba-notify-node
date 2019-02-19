require("dotenv").config();
const Snoowrap = require("snoowrap");

class Parser {
	constructor(userAgent, clientId, clientSecret, username, password) {
		this.userAgent = userAgent;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.username = username;
		this.password = password;
	}

	createSnoowrap() {
		return new Snoowrap({
			userAgent: this.userAgent,
			clientId: this.clientId,
			clientSecret: this.clientSecret,
			username: this.username,
			password: this.password,
		});
	}
}

class NBALivestreamsParser extends Parser {
	constructor(
		userAgent,
		clientId,
		clientSecret,
		username,
		password,
		tricode,
	) {
		super(userAgent, clientId, clientSecret, username, password);
		this.tricode = tricode;
	}

	async getLink() {
		const snoowrap = this.createSnoowrap();
		const subReddit = await snoowrap.getSubreddit("hardwareswap").getHot();
		const thread = await subReddit.find(item => item.title.includes(team))
			.id;

		const submission = await snoowrap
			.getSubmission(thread)
			.expandReplies({ limit: Infinity, depth: Infinity });
		const splitByHref = submission.comments[0].body_html.split("href=");
		const link = splitByHref.find(item =>
			/http:\/\/ripple.is.*/.test(item),
		);
		return link.split('"')[1];
	}
}

module.exports = NBALivestreamsParser;
