require("dotenv").config();
const axios = require("axios");
const schedule = require("node-schedule");
const Notification = require("./notification");

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

			const jobTime = `${39} ${20} ${day} ${month} *`;
			const cancelJob = schedule.scheduleJob(jobTime, async () => {
				try {
					const awaySubscriptionsResponse = await axios.get(
						`https://nba-notify-api.herokuapp.com/subscription?tricode=${Away}`,
					);
					const homeSubscriptionsResponse = await axios.get(
						`https://nba-notify-api.herokuapp.com/subscription?tricode=${Home}`,
					);

					const [
						awaySubscriptions,
						homeSubscriptions,
					] = await Promise.all([
						awaySubscriptionsResponse,
						homeSubscriptionsResponse,
					]);

					const userTokens = [
						...awaySubscriptions.data.subscription.userTokens,
						...homeSubscriptions.data.subscription.userTokens,
					];

					userTokens.forEach(token => {
						const notification = new Notification(
							Away,
							Home,
							StartTimeEastern,
							token,
							process.env.SERVER_KEY,
						);
						notification.sendNotification();
					});
				} catch (err) {
					// Fix API to handle no subscriptions for team
				}
			});
		},
	);
};

main();
