#!/usr/bin/bash
twitch_secret="$1"
broadcaster_id="$2"

twitch event trigger raid -F https://akenshi-bot.ashagni.live/api/twitch/eventsub -s $twitch_secret -t $broadcaster_id