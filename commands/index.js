import {
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import {
  ApplicationCommandTypes,
  ApplicationCommandOptionTypes,
} from "../utils/types.js";

const MAKE_COMMAND = {
  name: "make",
  description: "make a helper-embed to distribute automated servicing",
  type: ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      name: "ticket",
      description: "Make an interactive ticket embed",
      options: [
        {
          type: ApplicationCommandOptionTypes.CHANNEL,
          name: "where",
          description: "where you would like to send the embed",
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      name: "roles",
      description: "Make an interactive roles embed",
      options: [
        {
          type: ApplicationCommandOptionTypes.CHANNEL,
          name: "where",
          description: "where you would like to send the embed",
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      name: "booth",
      description: "Make an interactive booth embed",
      options: [
        {
          type: ApplicationCommandOptionTypes.CHANNEL,
          name: "where",
          description: "where you would like to send the embed",
          required: true,
        },
      ],
    },
  ],
};
const DM_COMMAND = {
  name: "dm",
  description: "send DMs to user(s) or a role(s)",
  type: ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      type: ApplicationCommandOptionTypes.MENTIONABLE,
      name: "who",
      description: "Whom the message is for",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "message",
      description: "What the message is",
      required: true,
    },
  ],
};

export const COMMANDS = {
  make: MAKE_COMMAND,
  dm: DM_COMMAND,
};
