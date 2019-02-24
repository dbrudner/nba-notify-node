require("dotenv").config();
const Snoowrap = require("snoowrap");
const axios = require("axios");

class NBALivestreamsParser {
	constructor(tricode) {
		this.snoowrap = new Snoowrap({
			userAgent: "NBA notify",
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			username: process.env.REDDIT_USER,
			password: process.env.REDDIT_PASS,
		});
		this.tricode = tricode;
	}

	async getLink() {
		try {
			const tricodeTeamMapResponse = await axios.get(
				"https://infinite-cove-44078.herokuapp.com/team-tricodes",
			);
			const tricodeTeamMap = tricodeTeamMapResponse.data.Teams;
			const team = tricodeTeamMap[this.tricode.toUpperCase()];

			const subReddit = await this.snoowrap
				.getSubreddit("nbastreams")
				.getHot();

			const thread = await subReddit.find(item =>
				item.title.toLowerCase().includes(team.toLowerCase()),
			).id;

			const submission = await this.snoowrap
				.getSubmission(thread)
				.expandReplies({ limit: Infinity, depth: Infinity });

			for (let i = 0; i < submission.comments.length; i++) {
				const comment = submission.comments[i];
				const author = await comment.author;

				if (author.name === "buffstreams") {
					const link = comment.body_html
						.split('href="')[1]
						.split('"')[0];

					return link;
				}
			}
		} catch (err) {
			return "nba.com";
		}
	}
}

module.exports = NBALivestreamsParser;
