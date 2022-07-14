import { BaseManager } from "./utils/manager.js";
import { COMMAND_RESPONSES } from "./responses/index.js";
import { Modal, User, Role } from "discord.js";
import { InteractionResponseType } from "discord-interactions";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
// const data = require("./config.json");

export class ResponseManager extends BaseManager {
  constructor(interactor) {
    super(interactor);
    this._guild = interactor._guild;
    this.success_res = {
      content: "✅ Recieved",
      flags: 64,
    };
  }
  /**
   * @param guildId: string
   * @param channelId: string - channel id to send message
   * @param message: MessageObject
   */
  async sendChannel(target, message) {
    if (Array.isArray(target)) {
      throw new Error("unsupported target type: Array");
      return;
    }
    const textChannel = await this._guild.channels.cache.get(target); //string
    if (textChannel) {
      console.log("sending message to text:", textChannel.name);
      textChannel.send(message);
      return;
    }
    const userChannel = await this._guild.members.cache.get(target);
    if (userChannel) {
      console.log("sending message to user:", userChannel.displayName);
      userChannel.send(message);
      return;
    } else {
      const roleMemberChannels = (
        await this._guild.roles.cache.get(target).members
      ).values();
      for (const member of roleMemberChannels) {
        console.log("sending message to user:", member.displayName);
        member.send(message);
      }
      return;
    }
    return;
  }
  async sendDM(users, message) {
    let targets = [];
    let target = "";
    if (Array.isArray(users)) {
      targets = users; // string []
      await targets.forEach(async (user) => {
        await this.sendChannel(user, message);
      });
    } else {
      (target = users), await this.sendChannel(target, message);
    }
  }
  async commandResponse() {
    const commandName = this._interaction.commandName;
    const command = COMMAND_RESPONSES[this._interaction.commandName];
    let target_feature = "";
    let target_channelId = "";
    let user = {};
    let msg = {};
    let res = {};
    if (this._interaction.options) {
      const hoistedOptions = this._interaction.options._hoistedOptions;
      switch (commandName) {
        case "make":
          target_feature = this._interaction.options._subcommand;
          target_channelId = hoistedOptions[0].value;
          res = command[target_feature].command;
          break;
        case "dm":
          [user, msg] = hoistedOptions;
          res = command.command;
          break;
      } //to change
    } else res = command.command;
    try {
      if (target_channelId) await this.sendChannel(target_channelId, res.data);
      else {
        switch (commandName) {
          case "dm":
            this.sendDM(user.value, msg.value);
            break;
        }
        return res.data;
      }
    } catch (err) {
      console.error(err);
    }
    return this.success_res;
  }
  async componentResponse() {
    const customId = this._interaction.customId;
    const component_ref = customId.match(/\w+/gm);
    const component = this.getComponent(component_ref).component;
    let res = JSON.parse(JSON.stringify(component[customId]));
    const isSelect = this._interaction.isSelectMenu();
    if (isSelect && res.data.custom_id)
      res.data.custom_id = `${res.data.custom_id}-${this._interaction.values[0]}`;
    if (res.type === InteractionResponseType.APPLICATION_MODAL) {
      const res_modal = new Modal(res.data);
      await this._interaction.showModal(res_modal);
    } else {
      const [split1, split2] = await this.generateProgramOpts();
      if (!res.data.options) {
        // console.log(res.data.options)
        if (this._interaction.channelId == "979068591943057418") {
          res.data.components[0].components[0].options = split1;
          return res.data;
        } else if (this._interaction.channelId == "979805273369763871") {
          res.data.components[0].components[0].options = split2;
          return res.data;
        }
      }
      return res.data;
    }
  }
  async modalResponse() {
    let customId = this._interaction.customId;
    const component_ref = customId.match(/\w+[^\s-]+/g);
    customId = component_ref.slice(0, -1).join("-");
    const component = this.getComponent(component_ref).modal;
    const res = component[customId];
    switch (component_ref[1]) {
      case "ticket":
        await this.submitResponse(component_ref[2]);
        await this._interaction.update(res.data);
        break;
      case "booth":
        let programName = component_ref[component_ref.length - 1];
        try {
          const team_channel = await this.boothMaker(programName);
          let boothRes = Object.assign(res);
          boothRes.data.content =
            boothRes.data.content + `click <#${team_channel.id}> to join`;
          await this._interaction.update(boothRes.data);
        } catch (err) {
          console.error(err);
        }
    }
    return;
  }
  async generateProgramOpts() {
    const model_option = {
      label: "VideoAsk",
      value: "VideoAsk",
      description: "VideoAsk by TypeForm",
      emoji: {
        id: null,
        name: "🧑‍💻",
      },
    };
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
  }
  async boothMaker(optionName) {
    let fieldMap = await this.parseActionRow(
      this._interaction.fields.components
    );
    let customId = this._interaction.customId;
    const component_ref = customId.match(/\w+[^\s-]+/g);
    customId = component_ref.slice(0, -1);
    customId.push("name");
    customId = customId.join("-");
    let channelName = fieldMap[customId] + ` - ${optionName}`;
    try {
      const category = await this._guild.channels.cache.get(
        "979203603573112842"
      );
      const createdChannel = await category.createChannel(channelName, {
        type: "GUILD_VOICE",
        topic: `${fieldMap[customId]} project channel`,
      });
      const ordered = await category.children.sorted((chaA, chaB) =>
        chaA.name > chaB.name ? 1 : chaA.name < chaB.name ? -1 : 0
      );
      ordered.forEach(async (channel, index) =>{
        channel.setPosition(index+1)
      });
      //       for(let channel of category){

      //       }
      return createdChannel;
    } catch (err) {
      console.error(err);
    }
  }
  async submitResponse(formType) {
    const fieldMap = await this.parseActionRow(
      this._interaction.fields.components
    );
    let customId = this._interaction.customId;
    const component_ref = customId.match(/\w+/gm);
    customId = component_ref.slice(0, -1).join("-");
    const data = {
      id: customId,
      id_ref: this._interaction.customId.match(/\w+/gm),
      owner: this._interaction.user.id,
      content: {
        subject: fieldMap[`${customId}-subject`],
        body: fieldMap[`${customId}-body`],
      },
    };
    const channelMap = {
      support: {
        channel_id: "979068522502193242",
        // user_id: ["507082086545358849"],
        // role_id: "979087777637478460",
        msg: (d) => {
          return {
            content: `[${
              d.id_ref[d.id_ref.length - 1]
            }]\n**${
              d.content.subject
            }**\nsubmitted by <@${d.owner}>\n---\n${d.content.body}`,
          };
        },
      },
    };
    const sendData = channelMap[formType];
    console.log(sendData)
    if (sendData.channel_id)
      this.sendChannel(sendData.channel_id, sendData.msg(data));
    else if (sendData.role_id)
      this.sendChannel(sendData.role_id, sendData.msg(data));
    else if (sendData.user_id)
      this.sendChannel(sendData.user_id, { content: sendData.msg(data) });
  }
  async parseActionRow(components) {
    const valueMap = {};
    components.forEach((row) => {
      const component = row.components[0];
      valueMap[component.customId] = component.value;
    });
    return valueMap;
  }
  getComponent(ref) {
    const component = COMMAND_RESPONSES[ref[0]][ref[1]];
    return component;
  }
  getResponseFunction(num_type) {
    // console.log(num_type, num_type === InteractionResponseType.UPDATE_MESSAGE)
    switch (num_type) {
      case InteractionResponseType.APPLICATION_MODAL:
        return this._interaction.showModal;
      case InteractionResponseType.UPDATE_MESSAGE:
        return this._interaction.update;
      case InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE:
        return this._interaction.reply;
    }
  }
}
