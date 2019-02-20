const axios = require("axios");

class Notification {
	constructor(away, home, startTimeEastern, userToken, serverKey) {
		this.away = away;
		this.home = home;
		this.startTimeEastern = startTimeEastern;
		this.userToken = userToken;
		this.serverKey = serverKey;
	}

	createNotificationBody() {
		return `${away} vs. ${home} started at ${startTimeEastern}`;
	}

	createNotification() {
		return {
			notification: {
				title: "NBA game started",
				body: createNotificationBody(),
				click_action: link,
				requireInteraction: true,
			},
			to: userToken,
		};
	}

	sendNotification() {
		axios.post(
			"https://fcm.googleapis.com/fcm/send",
			this.createNotification(),
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: serverKey,
				},
			},
		);
	}
}

module.exports = Notification;
