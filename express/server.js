'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');

const PoApi = require('../util/api');


let FREE = {}
let PREMIUM_FOTBAL = {}
let PREMIUM_TENIS = {}

function isFotbal(res) {
  return (res.league.toLowerCase().indexOf('league') > -1) || 
     (res.league.toLowerCase().indexOf('serie') > -1) ||
     (res.league.toLowerCase().indexOf('liga') > -1)
}

function getKey(d) {
  return d.getDate() + '-' + d.getMonth()+1 + '-' + d.getFullYear();
}
function getFreeGame(response) {
  return response.pontGratisAzi[0].game;
}
function getFreeBet(response) {
  return response.pontGratisAzi[0].bet;
}
function getFreeLeague(response) {
  return response.pontGratisAzi[0].league;
}

function getTennisMessageText(league, game, bet) {
  return [{
    "type": "text",
    "text": `🏆 ${league} 
             🎾 ${game} 
             🏅 ${bet}`,
  }]
}
function getFotbalMessageText(league, game, bet) {
  return [{
    "type": "text",
    "text": `🏆 ${league} 
             ⚽ ${game} 
             🏅 ${bet}`,
  }]
}

function getFinalResponse(messages) {
  return {
    "version": "v2",
    "content": {
      "messages": messages
    }
  }
}


const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Salut curiosule!</h1>');
  res.write('<p>Ne plac oamenii curiosi ca tine. Daca vrei sa lucrezi cu noi, trimite-ne un email pe collabs-at-ponturi-sportive.ro</p>');
  res.end();
});

router.get('/pont-gratuit', async (req, response) => {
  let today = new Date();
  let todayKey = getKey(today);
  if (FREE[todayKey] && FREE[todayKey].length) {
    // console.log("fetched from cache: ",FREE[todayKey])
    return response.json(getFinalResponse(FREE[todayKey]))
  } else {
    https.get('https://api.sheety.co/06def408e74850aef0fbd22a79539f9f/psApi/pontGratisAzi', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        let res = JSON.parse(data);
        let messages;
        if (isFotbal(res.pontGratisAzi[0])) { 
          messages = [...getFotbalMessageText(getFreeLeague(res), getFreeGame(res), getFreeBet(res))]
        } else { 
          messages = [...getTennisMessageText(getFreeLeague(res), getFreeGame(res), getFreeBet(res))]
        }

        FREE[todayKey] = messages;
        // console.log("fetched from sheets db: ", messages)

        return response.json(getFinalResponse(messages))
    });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }
});

router.get('/pont-premium-fotbal', (req, response) => {
  let today = new Date();
  let todayKey = getKey(today);
  if (PREMIUM_FOTBAL[todayKey] && PREMIUM_FOTBAL[todayKey].length) {
    // console.log("fetched from cache: ", PREMIUM_FOTBAL[todayKey])
    return response.json(getFinalResponse(PREMIUM_FOTBAL[todayKey]))
  } else {
    https.get('https://api.sheety.co/06def408e74850aef0fbd22a79539f9f/psApi/fotbalAzi', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        let res = JSON.parse(data);
        let messages = [];
        let items = res.fotbalAzi;
        for(let i=0;i<=items.length;i++) {
          let pont = items[i] || null;
          if(pont) {
            messages.push(...getFotbalMessageText(items[i].league, items[i].game, items[i].bet))
          }
        }

        PREMIUM_FOTBAL[todayKey] = messages;
        // console.log("fetched from sheets db: ", PREMIUM_FOTBAL[todayKey])
        return response.json(getFinalResponse(messages))
    });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }
});

router.get('/pont-premium-tenis', (req, response) => {
  let today = new Date();
  let todayKey = getKey(today);
  if (PREMIUM_TENIS[todayKey] && PREMIUM_TENIS[todayKey].length) {
    // console.log("fetched from cache: ", PREMIUM_TENIS[todayKey])
    return response.json(getFinalResponse(PREMIUM_TENIS[todayKey]))
  } else {
    https.get('https://api.sheety.co/06def408e74850aef0fbd22a79539f9f/psApi/tenisAzi', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        let res = JSON.parse(data);
        let messages = [];
        let items = res.tenisAzi;
        for(let i=0;i<=items.length;i++) {
          let pont = items[i] || null;
          if(pont) {
            messages.push(...getTennisMessageText(items[i].league, items[i].game, items[i].bet))
          }
        }

        PREMIUM_TENIS[todayKey] = messages;
        // console.log("fetched from sheets db: ", PREMIUM_TENIS[todayKey])

        return response.json(getFinalResponse(messages))
    });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }
});

router.get('/clean-cache', (req, res) => {
  FREE = {}
  PREMIUM_FOTBAL = {}
  PREMIUM_TENIS = {}

  return res.json(getFinalResponse([{
    "type": "text",
    "text": "CLEAN SUCCESS!"
  }]))
});


router.get('/pont-premium-baschet', (req, res) => res.json({ soon: 'in_curand' }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
