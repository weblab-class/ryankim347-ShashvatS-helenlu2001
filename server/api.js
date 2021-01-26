/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
const mongoose = require("mongoose");
// import models so we can interact with the database
const User = require("./models/user");
const Map = require("./models/map");
const CustomMap = require("./models/custom.js");
// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const { genGamePin, getClientId } = require("./util");

const { games } = require("./data/games");
const { Game } = require("./data/Game");
const { clients } = require("./data/client");
const { getSocketFromUserID } = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

// |------------------------------| | write your API methods below!|
// |------------------------------|

router.post("/create", (req, res) => {
  const clientId = getClientId(req);

  if (clientId === undefined) {
    res.json({ success: false, reason: "no client id cookie" });

    return;
  }

  const { name } = req.body;

  if (name == undefined) {
    res.json({ success: false, reason: "no name provided" });

    return;
  }

  let code = genGamePin();

  while (code in games) {
    code = genGamePin();
  }

  const game = new Game(code, clientId, name);

  games[code] = game;

  if (clientId in clients) {
    if (clients[clientId].room != code) {
      const socket = getSocketFromUserID(clientId);
      if (socket != undefined) socket.leave(clients[clientId].room);
    }
    clients[clientId].room = code;
  } else {
    clients[clientId] = {
      room: code,
    };
  }

  res.json({ code });

  game.sendLobbyInformation();
});

router.post("/join", (req, res) => {
  const clientId = getClientId(req);

  if (clientId === undefined) {
    res.json({ success: false, reason: "no client id cookie" });

    return;
  }

  const { name, code } = req.body;

  if (name == undefined || code == undefined) {
    res.json({ success: false, reason: "either name or code not provided" });

    return;
  }

  if (!(code in games)) {
    res.json({ success: false, reason: "invalid game code" });

    return;
  }

  const game = games[code];

  const joined = game.join(clientId, name);

  if (joined) {
    if (clientId in clients) {
      if (clients[clientId].room != code) {
        const socket = getSocketFromUserID(clientId);
        if (socket != undefined) socket.leave(clients[clientId].room);
      }
      clients[clientId].room = code;
    } else {
      clients[clientId] = {
        room: code,
      };
    }

    res.json({ success: true });

    game.sendLobbyInformation();

    return;
  }

  res.json({ success: false, reason: "unable to join, this could be because username is taken, game has started or is at capacity" });
});

router.post("/curRoom", (req, res) => {
  const clientId = getClientId(req);

  if (clientId === undefined) {
    res.json({ success: false, reason: "no client id cookie" });

    return;
  }

  if (clientId in clients && clients[clientId].room != undefined) {
    res.json({
      room: clients[clientId].room,
    });
    return;
  }

  res.json({});
  return;
});

// router.post("/initMap", (req,res) => {
//   const map0 = new Map({
//     id: 100,
//     x: [20,60,100,20,20,20,400,440,400,360,400],
//     y: [20,20,20,60,100,140,400,400,440,400,360]
//   })
//   map0.save().then((map) => {
//     console.log("inserted")
//   })
// })

router.post("/addMap", (req, res) => {
  const map = new CustomMap({
    creatorID: req.body.creatorID,
    creatorName: req.body.creatorName,
    name: req.body.name,
    width: req.body.width,
    height: req.body.height,
    x: req.body.x,
    y: req.body.y,
    mx: req.body.mx,
    my: req.body.my,
    public: req.body.public,
  });
  map.save().then((map) => {
    console.log("inserted new custom map!");
  });
});

router.get("/customMaps", (req, res) => {
  CustomMap.find({ $or: [{ creatorID: req.query.userId }, { public: true }] }).then((data) =>
    res.send({ data: data })
  );
});

router.get("/stats", (req, res) => {
  if(req.query.userId) {
    User.findById(req.query.userId).then((data) => res.send(data));
  }
});

router.post("/stats", (req, res) => {
  if(req.body.userId) {
    User.findOne({_id: req.body.userId}).then(
      (data) => {
        console.log('data for user with id ' + req.body.userId + ' '  + data);
        if(data) {
          console.log('updating...');
          let toUpdate = {
            games: data.games === undefined || data.games === null ? 1 : data.games + 1,
            points: data.points === undefined || data.points === null ? req.body.points : data.points + req.body.points,
            deaths: data.deaths === undefined || data.deaths === null ? req.body.deaths : data.deaths + req.body.deaths,
            wins: data.wins === undefined || data.wins === null ? req.body.wins : data.wins + req.body.wins,
          }
          User.findOneAndUpdate({_id: req.body.userId}, toUpdate).then((data2) => {
            console.log(data2);
            res.send(data2);
          })
        }
      }
    );
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
