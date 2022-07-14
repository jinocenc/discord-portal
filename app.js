// import express from "express";
import { Client, Intents } from "discord.js";
import { Routes } from "discord-api-types/v9";
import { Interactor } from "./interactor.js";
import { CommandController } from "./controller.js";
import { COMMANDS } from "./commands/index.js";
import { createRequire } from "module";
// import { VoiceConnectionStatus,getVoiceConnection } from '@discordjs/voice'
import express from 'express'

const app = express()

app.get('/', (req,res) => {
  res.send ()
})
const API_KEY = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

const helpers = {
  sendChannel: async (guild, target, message) => {
    if (Array.isArray(target)) {
      throw new Error("unsupported target type: Array");
      return;
    }
    const textChannel = await guild.channels.cache.get(target); //string
    if (textChannel) {
      console.log("sending message to text:", textChannel.name);
      textChannel.send(message);
      return;
    }
    const userChannel = await guild.members.cache.get(target);
    if (userChannel) {
      console.log("sending message to user:", userChannel.displayName);
      userChannel.send(message);
      return;
    } else {
      const roleMemberChannels = (
        await guild.roles.cache.get(target).members
      ).values();
      for (const member of roleMemberChannels) {
        console.log("sending message to user:", member.displayName);
        member.send(message);
      }
      return;
    }
    return;
  },
  programOpts: () => {
    const require = createRequire(import.meta.url);
    let programs = require("./program.json");
    try {
      programs = programs.map((program) => {
        let shortProgramName = "";
        let programName = program.programName;
        const programName_ref = programName.split(" ");
        if (programName_ref.length > 2)
          shortProgramName = programName.replace(
            /(\w)\w*\W*/g,
            function (_, i) {
              return i.toUpperCase();
            }
          );
        else programName = programName_ref.join("");
        const programOption = {
          label: programName,
          value: shortProgramName || programName,
        };
        return programOption;
      });
    } catch (err) {
      console.error(err);
    }
    programs.sort((a, b) => {
      if (a.value > b.value) return 1;
      if (b.value > a.value) return -1;
      else return 0;
    });
    return [programs.slice(0, 24), programs.slice(25, -1)];
  },
  createVoiceChannel: {},
  deleteVoiceChannel: {},
};

const programHash = async () => {
  let data = await helpers.programOpts();
  data = [...data[0], ...data[1]];
  let dict = {};
  data.forEach((obj) => {
    dict[obj.value] = obj.label;
  });
  return dict;
};

client.once("ready", async () => {
  console.log("ready");
});
client.on("voiceStateUpdate", async (oldState, newState) => {
  const Guild = client.guilds.cache.get("978167759630389270");
  const boothCategory = Guild.channels.cache.get("979203603573112842");
  if (newState.channel && newState.channel.parent === boothCategory) {
    const programs = await programHash();
    const parseUserProgram = (programList) => {
      const name_ref = newState.channel.name.match(/[^- ]*$/);
      const programName = programList[name_ref[0]];
      if (programName) return programName;
      else throw new Error("bad parse, no program with that channel name");
    };
    const roleNames = Object.values(programs);
    console.log(roleNames);
    const newUserProgram = parseUserProgram(programs);
    console.log(newUserProgram);
    let programRole = await Guild.roles.cache.find(async (role) => {
      console.log(role);
    });
    // let programRole = await Guild.roles.cache.find(async role =>{
    //   console.log('checking: ',role.name)
    //   // if(roleNames.includes(role)){
    //   //   await newState.member.roles.remove(role.id)
    //   //   console.log(`${role.name} removed`)
    //   // }
    //   console.log(typeof role.name, typeof newUserProgram)
    //   return (role.name.trim()=== newUserProgram.trim())
    // })
    // console.log(programRole.name)
    // if(programRole.name === newUserProgram){
    //   console.log('role found! adding..')
    //   await newState.member.roles.add(programRole.id)
    //   console.log('..role added')
    // }
    // else if (!programRole){
    //   console.log('role not found, creating..')
    //   Guild.roles.create({
    //     name: newUserProgram,
    //     color: 'DARK_GOLD'
    //   })
    //   await newState.member.roles.add(programRole.id)
    //   console.log('..role added')
    // }
  }
  if (newState.channelId === "979757195950428251") {
    console.log("joined breakout");
    const { member } = newState;
    const testId = null; //"979087777637478460";
    const RoleId = testId || "979124472248406056";
    const Category = Guild.channels.cache.get("979756506394279966");
    const roomCount = Category.children.size - 1;

    //create new channel
    try {
      const newChannel = await Category.createChannel(
        `help-breakout-${roomCount}`,
        {
          type: "GUILD_VOICE",
        }
      );
      // disconnect from old channel and join new channel
      await newState.setChannel(await newChannel.id);
      // send distress signal
      await helpers.sendChannel(
        Guild,
        RoleId,
        `Someone needs help!\n Check out the \`mentors\` channel:\nhttps://discord.com/channels/978167759630389270/979789248498659358`
      );
      await helpers.sendChannel(
        Guild,
        "979789248498659358",
        `${member} needs help in <#${newChannel.id}>\n---\n<@&${RoleId}>`
      );
    } catch (err) {
      console.error(err);
    }
  }
  if (newState.channel === null) {
    console.log("leaving vc");
    // breakout prefix
    const oldState_ref = oldState.channel.name.split("-");
    const oldChannel = oldState.channel;
    const isChannelOccupied = oldChannel.members.size;
    if (oldState_ref[0] == "help" && !isChannelOccupied) {
      oldState.channel.delete();
    }
  } else if (oldState.channelID === null) console.log("joining vc");
  //joined
  return;
});

client.on("interactionCreate", async (interaction) => {
  const interactor = new Interactor(interaction);
 //  const announcements_channel =
 //    // interactor._guild.channels.cache.get("979067755787591680");
 //   interactor._guild.channels.cache.get("979789248498659358");
 //  announcements_channel.send({
 //    embeds: [
 //      {
 //        title: `PilotCity Airtime2022 Announcement`,
 //        description: `Greetings @everyone, welcome to PilotCity Airtime2022!\n\nWe have a lot in store for all of you so be sure to check out the agenda over at https://www.pilotcity.com/airtime2022.\n
 // To kick off the event and to welcome newcomers, we’d like to offer you all a **FREE** token to join our program: https://www.pilotcity.com/sponsor/IIbHQmOB\n\nThis is a *single-use token*, so feel free to explore multiple programs, but make sure you’re interested in the one you apply the sponsorship code to. Once you get started, be sure to attend our workshops and reach out to any mentors if you need assistance!
 // `,
 //      },
 //    ],
 //  });

  // if (interaction.isApplicationCommand()) {
  //   await interactor._commands.request.deleteGlobalCommands();
  //   interaction.reply({
  //     content:
  //       "❌ invalid application command\n only **guild commands** accepted",
  //     flags: 64,
  //   });
  // }
  const success_response = {
    content: "✅ Recieved",
    flags: 64,
  };
  try {
    const reply = await interactor._commands.interactionHandler();
    console.log("pre-reply:", reply);
    if (reply) await interaction.reply(reply);
    console.log("---");
    // await interactor._commands.request.hasGuildCommands(COMMANDS);
    console.log("---");
  } catch (err) {
    console.error(err);
  }
});

client.login(API_KEY);
