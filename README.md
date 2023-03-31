# DECTalk_web
Simple web service for DECTalk

This is a nodejs-based webservice for DECTalk. It runs in a docker container.
It can be used by other docker containers (such as DECTalk_DiscordBot) on the same host and network dectalk_net, via http://dectalk_web:3000
It is also on http://localhost:3000 by default where you can go on to host it on the web (perhaps via reverse proxy using Caddy, Traefik et al)

## Install:

* Clone this repository
* Edit docker-compose.yml to your liking
* docker-compose up -d

The url should now be accessible based on your config (default will be http://dectalk_web:3000 and http://localhost:3000).

## Usage:

```http://dectalk_web:3000/say?text=[DECTalk text here, including phoneme data etc.]```
(or POST data accepted instead)

Returns say.wav with the spoken audio.

```http://dectalk_web:3000/say?b64&text=[Base64 encoded DECTalk text here w/phoneme data]```

Returns say.wav with the spoken audio - expects the DECTalk text to be base64 encoded first.
