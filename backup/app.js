// import {

//   RESPONSES,

//   COMMANDS,

//   HasGuildCommands,

//   InstallGuildCommand,

//   DeleteGuildCommand,

// } from "./commands.js";

// import { COMPONENT_RESPONSES } from "./components.js";

// import {

//   InteractionType,

//   InteractionResponseType,

//   MessageComponentTypes,

// } from "discord-interactions";

// import { DiscordRequest, VerifyDiscordRequest } from "./utils.js";

// // Create a new client instance

// const app = express();

// // Get port, or default to 3000

// const PORT = process.env.PORT || 3000;

// const API_KEY = process.env.DISCORD_TOKEN;

// function deleteResponse(token) {

//   const app_id = process.env.APPLICATION_ID;

//   const ep = `/webhooks/${app_id}/${token}/messages/@original`;

//   DiscordRequest(ep, {

//     method: "DELETE",

//     body: {},

//   });

// }

// app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) })); //401

// app.post("/", async function (req, res) {

//   const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//   let { id, type, data } = req.body;

//   await client.login(API_KEY);

//   await client.once("ready", async () => {

//     if (type == InteractionType.PING) //200

//       await res.send({

//         type: InteractionResponseType.PONG,

//       });

//     if (type == InteractionType.APPLICATION_COMMAND)

//       res.send(RESPONSES[data.name]);

//     if (type == InteractionType.MESSAGE_COMPONENT) {

//       console.log(data);

//       if (data.custom_id == "ticket-button")
