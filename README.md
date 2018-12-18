# Control Deck Plugin for Slack

This [Control Deck](https://github.com/danielmurphy/control-deck) plugin gives you two Slack features for your Stream Deck:

`toggle-status` - A simple button to toggle your Slack status between active and away.

`user` - Adds a user's avatar as a button on your Stream Deck. When they are online, the image will look normal, but when they are away their avatar will be desaturated. Pushing the button will open Slack to a DM conversation with them.

## Install

`npm install control-deck-slack`

## Configuration

### Status Toggle

Use `toggle-status` to toggle your own status on and off.`user_id` should be your slack user id.

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

Use `user` to setup DM shortcuts for your teammates.

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

Create a new [Slack Legacy Token](https://api.slack.com/custom-integrations/legacy-tokens) in your workspace. The plugin expects that access token to be in your `ENV` in `SLACK_API_TOKEN`.

## Contributing

Pull requests welcome!
