import {
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
  ApplicationCommandTypes,
} from "./lib/index.js";

export const ROLE_RESPONSE = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    embeds: [
      {
        title: "Role Picker",
        description: "😅 set your role",
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
        type: 1,
        components: [
          {
            custom_id: "picker-role-type",
            type: MessageComponentTypes.STRING_SELECT,
            options: [
              {
                label: "Student",
                value: "979028180730015784",
                description: "Program Participant",
                emoji: {
                  id: null,
                  name: "🙋",
                },
              },
              {
                label: "Teacher",
                value: "979028059791450122",
                description: "Program stakeholder",
                emoji: {
                  id: null,
                  name: "🧑‍🏫",
                },
              },
              {
                label: "Employer",
                value: "979028130750681138",
                description: "Employer",
                emoji: {
                  id: null,
                  name: "👷",
                },
              },
            ],
            placeholder: "Who are you?",
            min_values: 1,
            max_values: 1,
          },
        ],
      },
    ],
  },
};