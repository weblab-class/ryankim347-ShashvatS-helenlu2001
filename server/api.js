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
const Map = require("./models/map")
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

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
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

  res.json({ success: false, reason: "unable to join game" });
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

router.post("/initMap", (req,res) => {
  const map0 = new Map({
    id: 0,
    x: [100],
    y: [100]
  })
  map0.save().then((map) => {
    console.log("inserted")
  })
})

router.post("/numMaps", (req,res) => {
  res.send(3)
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
