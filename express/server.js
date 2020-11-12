'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const FREE = {
  '12-11-2020': {},
}

const PREMIUM_FOTBAL = {
  '12-11-2020': [],
}

const PREMIUM_TENIS = {
  '12-11-2020': [],
}

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello George.js!</h1>');
  res.end();
});
// https://api.sheety.co/06def408e74850aef0fbd22a79539f9f/psApi/pontGratisAzi
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.get('/pont-gratuit', (req, res) => res.json({
  "version": "v2",
  "content": {
    "messages": [
      {
        "type": "text",
        "text": "🎾 Eveniment gratuit "
      },
      {
        "type": "text",
        "text": "🏆 Castigator eveniment gratuit"
      },
    ]}
}));
router.get('/pont-premium-fotbal', (req, res) => res.json({
  "version": "v2",
  "content": {
    "messages": [
      {
        "type": "text",
        "text": "⚽️ Eveniment premium fotbal 1 "
      },
      {
        "type": "text",
        "text": "🏆 Castigator Eveniment premium fotbal 1"
      },
      {
        "type": "text",
        "text": "..."
      },
      {
        "type": "text",
        "text": "⚽️ Eveniment premium fotbal 2"
      },
      {
        "type": "text",
        "text": "🏆 Castigator Eveniment premium fotbal 2"
      },
      {
        "type": "text",
        "text": "..."
      },
      {
        "type": "text",
        "text": "⚽️ Eveniment premium fotbal 3"
      },
      {
        "type": "text",
        "text": "🏆 Castigator Eveniment premium fotbal 3"
      },
      {
        "type": "text",
        "text": "..."
      },
    ]}
}));
router.get('/pont-premium-tenis', (req, res) => res.json({
  "version": "v2",
  "content": {
    "messages": [
      {
        "type": "text",
        "text": "🎾 Eveniment premium tenis 1 "
      },
      {
        "type": "text",
        "text": "🏆 Castigator Eveniment premium tenis 1"
      },
      {
        "type": "text",
        "text": "..."
      },
      {
        "type": "text",
        "text": "🎾 Eveniment premium tenis 2"
      },
      {
        "type": "text",
        "text": "🏆 Castigator Eveniment premium tenis 2"
      },
      {
        "type": "text",
        "text": "..."
      },
      {
        "type": "text",
        "text": "🎾 Eveniment premium tenis 3"
      },
      {
        "type": "text",
        "text": "🏆 Castigator Eveniment premium tenis 3"
      },
      {
        "type": "text",
        "text": "..."
      },
    ]}
}));
router.get('/pont-premium-baschet', (req, res) => res.json({ pont: 'premium_baschet' }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
