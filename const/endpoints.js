export const ENDPOINTS = {
  //global
  postGlobalApplicationCommand: (applicationId, commandId) => {
    return `/applications/${applicationId}/commands/${commandId}`
  },
  getGlobalApplicationCommands: (applicationId) => {
    return `/applications/${applicationId}/commands`
  },
  getGlobalApplicationCommand: (applicationId, commandId) => {
    return `/applications/${applicationId}/commands/${commandId}`
  },
  patchGlobalApplicationCommand: (applicationId, commandId) => {
    return `/applications/${applicationId}/commands/${commandId}`
  },
  putGlobalApplicationCommands: (applicationId) => {
    return `/applications/${applicationId}/commands`
  },
  delGlobalApplicationCommand: (applicationId, commandId) => {
    return `/applications/${applicationId}/commands/${commandId}`
  },
  
  //guild 
  postGuildApplicationCommand: (applicationId, guildId) => {
    return `/applications/${applicationId}/guilds/${guildId}/commands`;
  },
  getGuildApplicationCommands: (applicationId, guildId) => {
    return `/applications/${applicationId}/guilds/${guildId}/commands`;
  },
  getGuildApplicationCommand: (applicationId, guildId, commandId) => {
    return `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`;
  },
  patchGuildApplicationCommand: (applicationId, guildId, commandId) => {
    return `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`;
  },
  putGuildApplicationCommands: (applicationId, guildId) => {
    return `/applications/${applicationId}/guilds/${guildId}/commands`
  },
  delGuildApplicationCommand: (applicationId, guildId, commandId) => {
    return `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`;
  },
};
