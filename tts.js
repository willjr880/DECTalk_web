const uuid = require('uuid');
const { exec } = require('child_process');
const fs = require('fs');
const express = require('express');
const app = express();
const config = require('./config.js');

function generateWav(text, res) {
  var filename = uuid.v4();
  var cmd = `cd ${config.paths.service}dectalk && ./say -a "${text}" -fo ${config.paths.temp}${filename}.wav`;
  var child = exec(cmd);
  child.stdout.pipe(process.stdout);
  child.on('exit', function () {
    var fileWithPath = `${config.paths.temp}${filename}.wav`;
    res.download(fileWithPath, 'say.wav');
  });
  child.on('error', function () {
    console.log('Error running say app. cmd was:' + cmd);
    res.status(500).send('Unexpected error');
  });
}

function checkAPIKey(apikey, res) {
 if (apikey != config.APIKey) {
  res.status(500).send('Invalid API Key');
 }
}

app.get('/', (req, res) => {
 if(config.showUsage) {
  res.sendFile(config.paths.service+'usage.html');
 } else {
  res.status(500).send('Invalid request');
 }
});

app.get('/say', (req, res) => {
  if (config.useAPIKey) { checkAPIKey(req.query.apikey, res); }
  var data = (req.query.b64 == '1') ? Buffer.from(req.query.text, 'base64').toString('utf-8') : decodeURIComponent(req.query.text);
  var dectalkText = data.replace(config.dangerousCharacters, '');
  generateWav(dectalkText, res);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/say', (req, res) => {
  if (config.useAPIKey) { checkAPIKey(req.body.apikey, res); }
  var data = (req.body.b64 == '1') ? Buffer.from(req.body.text, 'base64').toString('utf-8') : decodeURIComponent(req.body.text);
  var dectalkText = data.replace(config.dangerousCharacters, '');
  generateWav(dectalkText, res);
});

app.use((req, res, next) => {
  res.status(500).send('Invalid request');
});

app.listen(3000, () => {
  console.log('Server listening...');
});
