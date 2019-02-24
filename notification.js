require("dotenv").config();
const axios = require("axios");
const Parser = require("parser");

class Notification {
	constructor(away, home, startTimeEastern, userToken, serverKey) {
		this.away = away;
		this.home = home;
		this.startTimeEastern = startTimeEastern;
		this.userToken = userToken;
		this.serverKey = serverKey;
	}

	createNotificationBody() {
		return `${this.away} vs. ${this.home} started at ${
			this.startTimeEastern
		}`;
	}

	createNotification() {
		return {
			notification: {
				title: "NBA game started",
				body: this.createNotificationBody(),
				click_action: "https://google.com",
				requireInteraction: true,
			},
			to: this.userToken,
		};
	}

	sendNotification() {
		axios.post(
			"https://fcm.googleapis.com/fcm/send",
			this.createNotification(),
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: this.serverKey,
				},
			},
		);
	}
}

module.exports = Notification;
