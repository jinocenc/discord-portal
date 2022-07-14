import {
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
  ApplicationCommandTypes,
} from "./lib/index.js";

export const DM_RESPONSE = {
  command: {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "✅ message sent successfully",
      flags: 64,
    },
  },
};
