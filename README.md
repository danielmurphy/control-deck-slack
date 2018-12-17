# Control Deck Plugin for Slack

This [Control Deck](https://github.com/danielmurphy/control-deck) plugin gives you two Slack features for your Stream Deck:

`toggle-status` - A simple button to toggle your Slack status between active and away.

`user` - Adds a user's avatar as a button on your Stream Deck. When they are online, the image will look normal, but when they are away their avatar will be desaturated. Pushing the button will open Slack to a DM conversation with them.

## Configuration

### Status Toggle

```
"button_0": {
	"plugin": "control-deck-slack",
	"options": {
		"type": "toggle-status",
		"user_id": "XXXXXXXXX"
	}
}
```

### User Shortcut

```
"button_0": {
	"plugin": "control-deck-slack",
	"options": {
		"type": "user",
		"team_id": "TXXXXXXXX",
		"user_id": "UXXXXXXXX"
	}
}
```

`team_id` and `user_id` can be obtained from Slack's Web API.

### Generating a Slack Access Token

Create a new [Slack app](https://api.slack.com/apps?new_app=1) in your workspace. Be sure to give it `users:read` and `users:write` permissions, then install the app in your workspace. Once installed, you'll be able to generate an OAuth access token.

The plugin expects that access token to be in your `ENV` in `SLACK_API_TOKEN`.

Expects a Slack token in `ENV['SLACK_API_TOKEN']`

## Contributing

Pull requests welcome!
