const schedule = require("node-schedule");

const jobTime = "50 10 9 2 *";

const cancelJob = schedule.scheduleJob(jobTime, () => {
	console.log("Hey");
});
