// import express from "express";
import { Client, Intents, CategoryChannel, User } from "discord.js";
import { Interactor } from './interactor.js'
import{
  InstallGuildCommand,
  DeleteGuildCommand,
} from "./commands.js";

const API_KEY = process.env.DISCORD_TOKEN
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', async () => {
  console.log('ready')
  // await InstallGuildCommand(process.env.APPLICATION_ID, process.env.GUILD_ID, COMMANDS['make'])
  await DeleteGuildCommand(process.env.APPLICATION_ID, process.env.GUILD_ID, 'pick')
})
client.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return
  const interactor = new Interactor(interaction)
  interaction.reply(interactor.interactionHandler())
	// } else if (commandName === 'beep') {
	// 	await interaction.reply('Boop!');
	// }
});

client.login(API_KEY);

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
//         // change to ticket-button
//         await res.send();
//       else if (data.custom_id == "ticket-support-type") {
//         console.log(data);
//         await res.send();
//       } else if (data.custom_id == "picker-role-type") {
//         const roles = data.values;
//         const user_id = req.body.member.user.id;
//         const user = await client.guilds.cache
//           .get("954888204660654101")
//           .members.fetch(user_id);
//         user.roles.add(roles);
//         await res.send({
//           type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//           data: {
//             content: "Role is set! thanks",
//             flags: 64,
//           },
//           // data: {
//           //   content: "Role is set! thanks",
//           //   // components: [],
//           // },
//         });
//       } else if (data.custom_id == "booth-button") {
//         await res.send();
//       } else if (data.custom_id == "booth-program-select") {
//         await res.send();
//       }
//     }
//     if (type == InteractionType.APPLICATION_MODAL_SUBMIT) {
//       const booth_command = data.custom_id.match(/booth-prompt-\w+/gm);
//       if (booth_command) {
//         const program_name = data.custom_id.match(/(?<=booth-prompt-)\w+/gm)[0];
//         const team_name = data.components[0].components[0].value;
//         const guild = await client.guilds.cache.get(process.env.GUILD_ID);
//         const category = await guild.channels.cache.find(
//           (channel) =>
//             channel.name == program_name && channel.type == "GUILD_CATEGORY"
//         );
//         if (!category) {
//           category = await guild.channels.create(program_name, {
//             type: "GUILD_CATEGORY",
//           });
//         }
//         console.log(category);
//         const team_channel = await category.children.find(
//           (channel) => channel.name == team_name
//         );
//         if (team_channel)
//           await res.send({
//             type: InteractionResponseType.UPDATE_MESSAGE,
//             data: {
//               content: `❌ Looks like that team already exists!\n click <#${team_channel.id}> to join or try again`,
//               components: [],
//             },
//           });
//         else{
//             team_channel = await category.createChannel(team_name, {
//               type: "GUILD_VOICE",
//               topic: `team_name project channel`,
//             });
//           await res.send({
//             type: InteractionResponseType.UPDATE_MESSAGE,
//             data: {
//               content: `✅ You're all set!\n click <#${team_channel.id}> to join`,
//               components: [],
//             },
//           });
//         }
//       } else {
//         const support_type = data.custom_id.match(/(?<=ticket-prompt-)\w+/gm);
//         const user_id = req.body.member.user.id;
//         const content = data.components[0].components[0];
//         // if (data.custom_id == "ticket-prompt") {
//         // client.channels.cache.get('975107462761967666').send(content.value)
//         // console.log(req.body)
//         const guild = await client.guilds.cache.get(process.env.GUILD_ID);
//         // console.log(user);
//         const user = await guild.members.fetch(user_id);
//         const channel = await guild.channels.fetch("979068522502193242");
//         await channel.send({
//           content: `<@&${support_type}> ticket by <@${user.user.id}>\n\n> ${content.value}\n---`,
//         });
//         // user.send({
//         //   content: `${support_type} ticket by ${user.user.username}\n ${content.value}`,
//         // });
//         await res.send();
//       }
//     }
//   });
// });
// app.listen(PORT, async () => {
//   // await InstallGuildCommand(process.env.APPLICATION_ID, process.env.GUILD_ID, COMMANDS['make'])
//   // await DeleteGuildCommand(process.env.APPLICATION_ID, process.env.GUILD_ID, 'make')
//   HasGuildCommands(
//     process.env.APPLICATION_ID,
//     process.env.GUILD_ID,
//     Object.values(COMMANDS)
//   );
//   // console.log("listening on port", PORT);
// });
