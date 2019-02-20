const axios = require("axios");

const test = async () => {
	const awaySubscriptions = await axios.get(
		`https://nba-notify-api.herokuapp.com/subscription?tricode=lal`,
	);

	const homeSubscriptions = await axios.get(
		`https://nba-notify-api.herokuapp.com/subscription?tricode=chi`,
	);
	const resolved = await Promise.all([awaySubscriptions, homeSubscriptions]);

	console.log(resolved[0].status);
	console.log(resolved[1].data);
};

test();
