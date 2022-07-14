const dm1 = {
  id: "979434977714389033",

  application_id: "975865746817171626",

  version: "979504998301986846",

  default_permission: true,

  default_member_permissions: null,

  type: 1,

  name: "dm",

  description: "send DMs to user(s) or a role(s)",

  guild_id: "978167759630389270",

  options: [
    {
      type: 9,

      name: "who",

      description: "Whom the message is for",

      required: true,
    },

    {
      type: 3,

      name: "message",

      description: "What the message is",

      required: true,
    },
  ],
};
const dm2 = {
  name: "dm",

  description: "send DMs to user(s) or a role(s)",

  type: 1,

  options: [
    {
      name: "who",

      description: "Whom the message is for",

      type: 9,

      required: true,
    },
    {
      name: "message",

      description: "What the message is",

      type: 3,

      required: true,
    },
  ],
};
