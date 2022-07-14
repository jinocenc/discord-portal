import { InteractionType, InteractionResponseType } from 'discord-interactions'
import {CommandController} from './controller.js'

export class Interactor{
  constructor(interaction){
    this._interaction = interaction
    this._client = interaction.client
    this._commands = new CommandController(this)
  }
  get _guild(){
    return this._client.guilds.cache.get(this._interaction.guildId)
  }
  get _channels(){
    return this._guild.channels.cache
  }
  
}