const path = require('path');
const { RTMClient, WebClient } = require('@slack/client');

class ControlDeckSlack {
	constructor(streamDeck, buttonId, options) {
		this.streamDeck = streamDeck;
		this.buttonId = buttonId;
		let myPresence = 'away';

		const slackToken = process.env.SLACK_API_TOKEN;
		const web = new WebClient(slackToken);
		const rtm = new RTMClient(slackToken);

		this._updateButton(myPresence);

		rtm.start({
			batch_presence_aware: true
		});

		rtm.subscribePresence([options.user_id]);

		rtm.on('presence_change', event => {
			myPresence = event.presence;
			this._updateButton(myPresence);
		});

		streamDeck.on('up', keyIndex => {
			if (keyIndex == buttonId) {
				let newStatus = myPresence === 'away' ? 'auto' : 'away';
				web.users.setPresence({ presence: newStatus });
				this._updateButton(newStatus);
			}
		});
	}

	_updateButton(status) {
		let icon = status === 'away' ? 'offline.png' : 'online.png';
		this.streamDeck.fillImageFromFile(
			this.buttonId,
			path.resolve(__dirname, `icons/${icon}`)
		);
	}
}

module.exports = ControlDeckSlack;
