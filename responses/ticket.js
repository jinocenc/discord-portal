import {
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import { ApplicationCommandTypes } from "../utils/types.js";

const TICKET_COMMAND_RESPONSE = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            // Value for your app to identify the button
            custom_id: "make-ticket-support-button",
            label: "Submit",
            style: ButtonStyleTypes.SUCCESS,
          },
        ],
      },
    ],
    embeds: [
      {
        title: "Bug Report Ticket",
        description:
          "Need help? Click on submit and fill out the form. We'll get to you as soon as we can",
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
  },
};

const TICKET_COMPONENT_RESPONSE = {
  "make-ticket-support-type": {
    type: InteractionResponseType.APPLICATION_MODAL,
    data: {
      custom_id: `make-ticket-support-prompt`,
      title: "What's the problem?",
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              custom_id: "make-ticket-support-prompt-subject",
              type: MessageComponentTypes.INPUT_TEXT,
              style: 1,
              label: "Question",
              required: true,
            },
          ],
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              custom_id: "make-ticket-support-prompt-body",
              type: MessageComponentTypes.INPUT_TEXT,
              style: 2,
              label: "Additional Information",
              required: true,
            },
          ],
        },
      ],
    },
  },
  "make-ticket-support-button": {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "select a ticket type",
      components: [
        {
          type: 1,
          components: [
            {
              custom_id: "make-ticket-support-type",
              type: MessageComponentTypes.STRING_SELECT,
              options: [
                {
                  label: "Bug",
                  value: "bug",
                  description: "An issue with using the PilotCity app",
                  emoji: {
                    id: null,
                    name: "🐛",
                  },
                },
                {
                  label: "Program",
                  value: "program",
                  description: "A question relating to your program",
                  emoji: {
                    id: null,
                    name: "🧑‍💻",
                  },
                },
                {
                  label: "Platform",
                  value: "platform",
                  description: "A question related to how the PilotCity works",
                  emoji: {
                    id: null,
                    name: "🧑‍🏫",
                  },
                },
              ],
              placeholder: "What kind of issue/question?",
              min_values: 1,
              max_values: 1,
            },
          ],
        },
      ],
      flags: 64,
    },
  },
};

const TICKET_MODAL_RESPONSE = {
  "make-ticket-support-prompt": {
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      content: "✅ You're all set!\nThanks for the feedback",
      components: [],
    },
  },
};

export const TICKET_RESPONSE = {
  command: TICKET_COMMAND_RESPONSE,
  component: TICKET_COMPONENT_RESPONSE,
  modal: TICKET_MODAL_RESPONSE,
};
