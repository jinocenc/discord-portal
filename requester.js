import fetch from "node-fetch";
import { verifyKey } from "discord-interactions";
import { ENDPOINTS } from "./const/index.js";
import { BaseManager } from "./utils/manager.js";

export class RequestManager extends BaseManager {
  constructor(interactor) {
    super(interactor);
    this._guildId = interactor._guild.id;
    this._applicationId = process.env.APPLICATION_ID;
  }
  /**
   * Compares if a list of commands are already installed
   * @param commands: ApplicationCommand[] - command data to compare
   * @return void
   */
  async hasGuildCommands(commands) {
    let deletableCommands = [];
    let installedCommands = [];
    try {
      const endpoint = ENDPOINTS.getGuildApplicationCommands(
        this._applicationId,
        this._guildId
      );
      const res = await this.discordRequest(endpoint, { method: "GET" });
      installedCommands = await res.json();
    } catch (err) {
      console.error(err);
    }
    if (installedCommands) {
      installedCommands.forEach((command) => {
        if (!Object.keys(commands).includes(command.name))
          deletableCommands.push(command);
      });
      await Object.values(commands).forEach(
        async (c) => await this.hasGuildCommand(c, installedCommands)
      );
    }
    if (deletableCommands)
      await deletableCommands.forEach(
        async (c) => await this.deleteGuildCommand(c, c.id)
      );
  }
  /**
   * Compares if a command is already installed
   * @param command: ApplicationCommand - command data to compare
   * @private
   */
  async hasGuildCommand(command, installedCommands) {
    try {
      if (installedCommands) {
        const installedCommand = installedCommands.find(
          (c) => JSON.stringify(c.options) == JSON.stringify(command.options)
        );
        if (installedCommand) {
          console.log(`"${command["name"]}" command already installed`);
          await this.updateGuildCommand(command, installedCommand.id);
        } else {
          await this.installGuildCommand(command);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  /**
   * Create guild command
   * @param command: ApplicationCommand - command data
   * @return void
   */
  async installGuildCommand(command) {
    const endpoint = ENDPOINTS.postGuildApplicationCommand(
      this._applicationId,
      this._guildId
    );
    try {
      console.info(`installing ${command.name}`)
      await this.discordRequest(endpoint, { method: "POST", body: command });
      console.log("%c%s","color: white; background: green",`${command.name} installed!`);
    } catch (err) {
      console.error("error installing guild command:");
      console.error(err);
    }
  }
  /**
   * Update guild command
   * @param command: ApplicationCommand - updated command data
   * @param commandId: string - id of command to update
   * @return void
   */
  async updateGuildCommand(command, commandId) {
    const endpoint = ENDPOINTS.patchGuildApplicationCommand(
      this._applicationId,
      this._guildId,
      commandId
    );
    try {
      console.info(`updating ${command.name}`)
      await this.discordRequest(endpoint, { method: "PATCH", body: command });
      console.log("%c%s","color: white; background: green",`${command.name} has been updated`);
    } catch (err) {
      console.error("error updating guild command:");
      console.error(err);
    }
  }
  /**
   * Deletes application commands
   * @param command: ApplicationCommand - command to be deleted
   * @return void
   * @private
   */
  async deleteGuildCommand(command, commandId) {
    const endpoint = ENDPOINTS.delGuildApplicationCommand(
      this._applicationId,
      this._guildId,
      commandId
    );
    try {
      console.info(`deleting ${command.name}`);
      const res = await this.discordRequest(endpoint, { method: "DELETE" });
      console.log("%c%s","color: white; background: green",`deleted ${command.name}`);
    } catch (err) {
      console.error("error while deleting");
      console.error(err);
    }
  }
  /**
   * Submit a request to a discord endpoint
   * @param endpoint: string - the target of the requeset
   * @param options: object - http request options
   * @private
   * @return void
   */
  async discordRequest(endpoint, options) {
    // append endpoint to root API URL
    const url = "https://discord.com/api/v10/" + endpoint;
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body);
    // Use node-fetch to make requests
    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        "Content-Type": "application/json; charset=UTF-8",
        "User-Agent": "DiscordBot",
      },
      ...options,
    });
    // throw API errors
    if (!res.ok) {
      const data = await res.json();
      console.log(res.status);
      throw new Error(JSON.stringify(data));
    }
    // return original response
    return res;
  }

  /**
   * Verify request middleware
   * @deprecated
   * @params clientKey: string - API key for hashing signatures
   */
  verifyDiscordRequest(clientKey) {
    return function (req, res, buf, encoding) {
      const signature = req.get("X-Signature-Ed25519");
      const timestamp = req.get("X-Signature-Timestamp");

      const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
      if (!isValidRequest) {
        res.status(401).send("Bad request signature");
        throw new Error("Bad request signature");
      }
    };
  }
  /**
   * Delete all installed global commands
   * @return void
   */
  async deleteGlobalCommands() {
    const endpoint1 = ENDPOINTS.getGlobalApplicationCommands(
      this._applicationId
    );
    try {
      let globalCommands = await this.discordRequest(endpoint1, {
        method: "GET",
      });
      globalCommands = await globalCommands.json();
      globalCommands.forEach(async (c) => {
        const endpoint2 = ENDPOINTS.delGlobalApplicationCommand(
          this._applicationId,
          c.id
        );
        console.log(`deleting ${c.name}`)
        await this.discordRequest(endpoint2, { method: "DELETE" });
      });
      console.log("%c%s","color: white; background: green",'Global commands deleted')
    } catch (err) {
      console.error("error deleting global commands"), console.error(err);
    }
  }
}
