import express from "express";
import { DiscordHTTPClient } from './client.js'
import { COMMANDS, RESPONSES } from './commands.js'
import { InteractionType } from "discord-interactions";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.DISCORD_TOKEN

app.post("/interactions", async function (req, res) {
  // Checking signature (requirement 1.)
  const Client = new DiscordHTTPClient(API_KEY, req)
  let isVerified = Client._validateRequest()
  if (!isVerified) {
      res.status(401).send(JSON.stringify('invalid request signature'))
  }
  // Replying to ping (requirement 2.)
  const { type, data } = Client._requestBody
  if (type == InteractionType.PING) {
    res.send(JSON.stringify({ "type": 1 }))
  }
  // Command invocation
  if (type == InteractionType.APPLICATION_COMMAND){
    res.send(JSON.stringify(RESPONSES[data.name]))
  }
  // Message Response
  if(type == InteractionType.MESSAGE_COMPONENT){

  }
  // Commmand upsert
  Client.commands.hasCommands(Object.values(COMMANDS))
});

