'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

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
        "text": "🎾 TEST API - TEST API"
      },
      {
        "type": "text",
        "text": "🏆 WINNER TEST API"
      },
    ]}}));
router.get('/pont-premium-fotbal', (req, res) => res.json({ pont: 'premium_fotbal' }));
router.get('/pont-premium-tenis', (req, res) => res.json({ pont: 'premium_tenis' }));
router.get('/pont-premium-baschet', (req, res) => res.json({ pont: 'premium_baschet' }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
