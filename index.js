const path = require('path');
const { RTMClient } = require('@slack/client');
const sharp = require('sharp');
const request = require('request').defaults({ encoding: null });
const fs = require('fs');

class ControlDeckSlack {
  constructor(streamDeck, buttonId, options) {
    console.log('still here');
    if (options.type === 'toggle-status') {
      new ToggleStatus(streamDeck, buttonId, options);
    } else if (options.type === 'show-user-status') {
      new ShowUserStatus(streamDeck, buttonId, options);
    }
  }
}

class ShowUserStatus {
  constructor(streamDeck, buttonId, options) {
    this.streamDeck = streamDeck;
    this.buttonId = buttonId;
    this.userId = options.user_id;

    const slackToken = process.env.SLACK_API_TOKEN;
    // const web = new WebClient(slackToken);
    const rtm = new RTMClient(slackToken);

    // web.users.info({ user: this.userId }).then(data => {

    // console.log('heyo');
    // const userAvatarURL = data.user.profile.image_72;
    const userAvatarURL =
      'https://avatars.slack-edge.com/2018-04-10/344384085874_2eec81c1f90277cd0bb6_72.jpg';
    request(userAvatarURL, (error, response, body) => {
      // sharp(body)
      //   .flatten()
      //   .resize(streamDeck.ICON_SIZE, streamDeck.ICON_SIZE)
      //   .raw()
      //   .toBuffer()
      //   .then(buffer => {
      //     this.onlineImage = buffer;
      //   });
      sharp(body)
        .flatten()
        .resize(streamDeck.ICON_SIZE, streamDeck.ICON_SIZE)
        .raw()
        .toBuffer()
        .then(buffer => {
          this.offlineImage = buffer;
        });
    });
    // });

    rtm.start({
      batch_presence_aware: true
    });

    rtm.subscribePresence([this.userId]);

    rtm.on('presence_change', event => {
      console.log(`setting to ${event.presence}`);
      event.presence === 'active'
        ? streamDeck.fillImage(this.buttonId, this.onlineImage)
        : streamDeck.fillColor(this.buttonId, this.offlineImage);
    });
  }
}

class ToggleStatus {
  constructor(streamDeck, buttonId, options) {
    this.streamDeck = streamDeck;
    this.buttonId = buttonId;
    let myPresence = 'away';

    const slackToken = process.env.SLACK_API_TOKEN;
    // const web = new WebClient(slackToken);
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
      console.log('up!');
      if (keyIndex === buttonId) {
        let newStatus = myPresence === 'away' ? 'auto' : 'away';
        // web.users.setPresence({ presence: newStatus });
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
