'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');

const PoApi = require('../util/api');


const FREE = {
  '12-11-2020': {},
}

const PREMIUM_FOTBAL = {
  '12-11-2020': [],
}

const PREMIUM_TENIS = {
  '12-11-2020': [],
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

function getPontGratuitMessages() {
  // let poApi = new PoApi(http);


}

function getPontPremiumFotbalMessages() {
  return [
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
    }
  ]
}

function getPontPremiumTenisMessages() {
  return [
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
    }
  ]
}

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Salut curiosule!</h1>');
  res.write('<p>Ne plac oamenii curiosi ca tine. Daca vrei sa lucrezi cu noi, trimite-ne un email pe collabs-at-ponturi-sportive.ro</p>');
  res.end();
});

router.get('/pont-gratuit', async (req, response) => {

  // superagent.get('https://api.sheety.co/06def408e74850aef0fbd22a79539f9f/psApi/pontGratisAzi')
  // // .query({ api_key: 'DEMO_KEY', date: '2017-08-02' })
  // .end((err, res) => {
  //   if (err) { return console.log(err); }
  //   let messages = [
  //     {
  //       "type": "text",
  //       "text": "🎾 " + getFreeGame(res)
  //     },
  //     {
  //       "type": "text",
  //       "text": "🏆 " + getFreeBet(res)
  //     }
  //   ]
  //   console.log(messages)

  //   return response.json({
  //     "version": "v2",
  //     "content": {
  //       "messages": messages
  //     }
  //   })
  // });

  https.get('https://api.sheety.co/06def408e74850aef0fbd22a79539f9f/psApi/pontGratisAzi', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      let res = JSON.parse(data);

      let messages = [
      {
        "type": "text",
        "text": "🎾 " + getFreeGame(res)
      },
      {
        "type": "text",
        "text": "🏆 " + getFreeBet(res)
      }
    ]
    console.log(messages)

    return response.json({
      "version": "v2",
      "content": {
        "messages": messages
      }
    })
  });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});

router.get('/pont-premium-fotbal', (req, res) => {
  return res.json({
    "version": "v2",
    "content": {
      "messages": getPontPremiumFotbalMessages()
    }
  })
});

router.get('/pont-premium-tenis', (req, res) => {
  return res.json({
    "version": "v2",
    "content": {
      "messages": getPontPremiumTenisMessages()
    }
  })
});

router.get('/pont-premium-baschet', (req, res) => res.json({ soon: 'in_curand' }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
