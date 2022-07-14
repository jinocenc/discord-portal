import {
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
  ApplicationCommandTypes,
} from "./lib/index.js";

const BOOTH_COMMAND_REPONSE = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    embeds: [
      {
        title: "Booth Maker",
        description: "Request a booth for you and your team",
        thumbnail: {
          url: "",
          height: 0,
          width: 0,
        },
        image: {
          url: "",
          height: 0,
          width: 0,
        },
      },
    ],
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            // Value for your app to identify the button
            custom_id: "make-booth-button",
            label: "Request",
            style: ButtonStyleTypes.SUCCESS,
          },
        ],
      },
    ],
  },
};
const BOOTH_COMPONENT_REPONSE = {
  "make-booth-button": {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "Tell us what program you're in",
      components: [
        {
          type: 1,
          components: [
            {
              custom_id: "make-booth-program-type",
              type: MessageComponentTypes.STRING_SELECT,
              options: [
                // {
                //   label: "VideoAsk",
                //   value: "VideoAsk",
                //   description: "VideoAsk by TypeForm",
                //   emoji: {
                //     id: null,
                //     name: "🧑‍💻",
                //   },
                // },
              ],
              placeholder: "Pick your Program",
              min_values: 1,
              max_values: 1,
            },
          ],
        },
      ],
      flags: 64,
    },
  },
  "make-booth-program-type": {
    type: InteractionResponseType.APPLICATION_MODAL,
    data: {
      custom_id: `make-booth-prompt`,
      title: "Tell us the name of your team",
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              custom_id: "make-booth-prompt-name",
              type: MessageComponentTypes.INPUT_TEXT,
              style: 1,
              label: "Team Name",
              required: true,
            },
          ],
        },
      ],
    },
  },
};
const BOOTH_MODAL_RESPONSE = {
  "make-booth-prompt": {
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      content: `✅ You're all set!\n`, //click <#${team_channel.id}> to join`,
      components: [],
    },
  },
};

export const BOOTH_RESPONSE = {
  command: BOOTH_COMMAND_REPONSE,
  component: BOOTH_COMPONENT_REPONSE,
  modal: BOOTH_MODAL_RESPONSE,
};
