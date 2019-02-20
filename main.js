require("dotenv").config();
const axios = require("axios");
const schedule = require("node-schedule");

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

			const jobTime = `${2} ${hour} ${day} ${month} *`;

			const cancelJob = schedule.scheduleJob(jobTime, async () => {
				const awaySubscriptionsResponse = await axios.get(
					`https://nba-notify-api.herokuapp.com/subscription?tricode=lal`,
				);
				const homeSubscriptionsResponse = await axios.get(
					`https://nba-notify-api.herokuapp.com/subscription?tricode=chi`,
				);

				const [
					awaySubscriptions,
					homeSubscriptions,
				] = await Promise.all([
					awaySubscriptionsResponse,
					homeSubscriptionsResponse,
				]);

				const subscriptions = [
					...awaySubscriptions.data,
					...homeSubscriptions.data,
				];

				subscriptions.forEach(sub => {
					const notification = new Notification(
						Away,
						Home,
						StartTimeEastern,
						sub.userToken,
						process.env.SERVER_KEY,
					);

					notification.sendNotification();
				});
			});
		},
	);
};

main();
