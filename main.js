require("dotenv").config();
const axios = require("axios");
const schedule = require("node-schedule");

const main = async () => {
	const res = await axios.get(
		"https://infinite-cove-44078.herokuapp.com/today-simple-schedule",
	);
	const { todaySchedule } = await res.data;

	await res.data.TodaySchedule.forEach(
		({ Away, StartTimeEastern, StartDateEastern }) => {
			const hour = parseInt(StartTimeEastern.split(":")[0]) - 1;
			const day = parseInt(
				StartDateEastern.substr(StartDateEastern.length - 2),
			);
			const month = parseInt(StartDateEastern.substring(4, 6)) - 1;
			const year = parseInt(StartDateEastern.substring(0, 4));

			const jobTime = new Date(year, month, day, hour, 0, 0);
			const cancelJob = schedule.scheduleJob(jobTime, async () => {
				const res = await axios.get(
					`https://nba-notify-api.herokuapp.com/subscription?tricode=${Away}`,
				);
				const data = await res.data;

				data.subscription.userTokens.forEach(async userToken => {
					const notification = {
						notification: {
							title: "NBA game started",
							body: `${Away} vs. ${Home} started at ${StartTimeEastern}`,
							click_action: "https://nba-notify.herokuapp.com",
						},
						to: userToken,
					};

					axios.post(
						"https://fcm.googleapis.com/fcm/send",
						notification,
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: process.env.SERVER_KEY,
							},
						},
					);
				});
			});
		},
	);
};

main();
