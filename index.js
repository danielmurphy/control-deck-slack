const path = require('path');
const { exec } = require('child_process');
const { RTMClient, WebClient } = require('@slack/client');

const sharp = require('sharp');
const request = require('request').defaults({ encoding: null });

class ControlDeckSlack {
  constructor(streamDeck, buttonId, options) {
    if (options.type === 'toggle-status') {
      new ToggleStatus(streamDeck, buttonId, options);
    } else if (options.type === 'user') {
      new User(streamDeck, buttonId, options);
    }
  }
}

class User {
  constructor(streamDeck, buttonId, options) {
    this.streamDeck = streamDeck;
    this.buttonId = buttonId;
    this.userId = options.user_id;

    const slackToken = process.env.SLACK_API_TOKEN;
    const web = new WebClient(slackToken);
    const rtm = new RTMClient(slackToken);

    this.streamDeck.on('down', keyIndex => {
      if (keyIndex === this.buttonId) {
        exec(
          `open 'slack://user?team=${options.team_id}&id=${options.user_id}'`
        );
      }
    });

    rtm.start({
      batch_presence_aware: true
    });

    rtm.subscribePresence([this.userId]);

    web.users.info({ user: this.userId }).then(data => {
      const userAvatarURL = data.user.profile.image_original;

      request(userAvatarURL, (error, response, body) => {
        sharp(body)
          .png()
          .toBuffer()
          .then(buffer => {
            this.onlineImage = buffer;
          });

        sharp(body)
          .grayscale()
          .png()
          .toBuffer()
          .then(buffer => {
            this.offlineImage = buffer;
          });

        rtm.on('presence_change', event => {
          event.presence === 'active'
            ? streamDeck.fillImageFromFile(this.buttonId, this.onlineImage)
            : streamDeck.fillImageFromFile(this.buttonId, this.offlineImage);
        });
      });
    });
  }
}

class ToggleStatus {
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
      if (keyIndex === buttonId) {
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
