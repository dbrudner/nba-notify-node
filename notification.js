require("dotenv").config();
const axios = require("axios");
const Parser = require("./parser");

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

	async createNotification() {
		const parser = new Parser(this.away);
		const link = await parser.getLink();
		return {
			notification: {
				title: "NBA game started",
				body: this.createNotificationBody(),
				click_action: link,
				requireInteraction: true,
			},
			to: this.userToken,
		};
	}

	async sendNotification() {
		const body = await this.createNotification();
		const response = await axios.post(
			"https://fcm.googleapis.com/fcm/send",
			body,
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
