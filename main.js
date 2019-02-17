require("dotenv").config();
const axios = require("axios");
const schedule = require("node-schedule");
const Snoowrap = require("snoowrap");
const teamCodes = require("./team-codes");

const r = new Snoowrap({
	userAgent: "reddit-bot-example-node",
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS,
});

const main = async () => {
	const res = await axios.get(
		"https://infinite-cove-44078.herokuapp.com/today-simple-schedule",
	);

	await res.data.TodaySchedule.forEach(
		({ Away, Home, StartTimeEastern, StartDateEastern }) => {
			const minute = StartTimeEastern.split(":")[1].substring(0, 2);

			const isPM = StartTimeEastern.split(" ")[1] === "PM";

			const hour = isPM
				? parseInt(StartTimeEastern.split(":")[0]) + 12
				: StartTimeEastern.split(":")[0];

			const day = StartDateEastern.substr(StartDateEastern.length - 2);

			const month = StartDateEastern.substring(4, 6);

			const jobTime = `${59} ${hour - 1} ${day} ${month} *`;
			console.log(jobTime);
			const cancelJob = schedule.scheduleJob(jobTime, async () => {
				console.log("HI");
				await axios.get(
					`https://nba-notify-api.herokuapp.com/subscription?tricode=${Away}`,
				);
				const data = await res.data;

				axios
					.get(
						`https://nba-notify-api.herokuapp.com/subscription?tricode=${Away}`,
					)
					.then(res => {
						console.log(res);
						console.log(res.data.subscription.userTokens);

						r.getSubreddit("nbastreams")
							.getHot()
							.then(res => {
								console.log("HI");

								const thread = res.find(item =>
									item.title.includes(
										teamCodes[Away.toLowerCase()],
									),
								).id;
								r.getSubmission(thread)
									.expandReplies({
										limit: Infinity,
										depth: Infinity,
									})
									.then(data => {
										console.log("HI");

										const split = data.comments[0].body_html.split(
											"href=",
										);
										const link = split
											.find(item =>
												/http:\/\/ripple.is.*/.test(
													item,
												),
											)
											.split('"')[1];

										res.data.subscription.userTokens.forEach(
											async userToken => {
												console.log(link);
												const notification = {
													notification: {
														title:
															"NBA game started",
														body: `${Away} vs. ${Home} started at ${StartTimeEastern}`,
														click_action: link,
														requireInteraction: true,
													},
													to: userToken,
												};

												axios.post(
													"https://fcm.googleapis.com/fcm/send",
													notification,
													{
														headers: {
															"Content-Type":
																"application/json",
															Authorization:
																process.env
																	.SERVER_KEY,
														},
													},
												);
											},
										);
									});
							});
					});
			});
		},
	);
};

main();
