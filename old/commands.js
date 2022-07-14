import { BaseManager } from "./util.js";
import { ButtonStyleTypes, InteractionResponseType, MessageComponentTypes } from "discord-interactions";


export class CommandManager extends BaseManager{
    constructor(client){
        super(client)
    }
  
    hasCommands(commands){
        if(!(this.client._appId || this.client._guildId)) return
        commands.forEach(command => {
            this._hasCommand(command)
        });
    }
    async _hasCommand(command){
        let commands = await this._commands()
        if(!commands) return
        if (commands.map(c => c.name).includes(command.name)) return true
        else await this._addCommand(command)
    }
    async _addCommand(command){
        try{   
            await this.client.requester.DiscordRequest(
                'APPLICATION_COMMANDS',
                { 
                    method: 'POST', 
                    body: JSON.stringify(command)
                }
            )
        } catch (err) {
            console.err(err)
        }
    }
    async _commands(){
        try{
            const res = await this.client.requester.DiscordRequest(
                'APPLICATION_COMMANDS',
                { method: 'GET'}
            )
            return res.json()
        } catch (err) {
            console.err(err)
        }
    }
}
const MAKE_COMMAND = {
    name: 'make',
    description: 'Generate an Interaction',
    type: 1, // Application Command Type
};
export const COMMANDS= {
  MAKE_COMMAND
}
const MAKE_RESPONSE = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: { 
    embeds:[{
      title: "Bug Report Ticket",
      description: "Need help? Click on the ticket",
      thumbnail:{
        url: '',
        height: 0,
        width: 0
      },
      image:{
        url: '',
        height: 0,
        width: 0
      }
    }],
    components: [{
      type: MessageComponentTypes.ACTION_ROW,
      components: [{
        type: MessageComponentTypes.BUTTON,
        // Value for your app to identify the button
        custom_id: 'my_button',
        label: 'Submit',
        style: ButtonStyleTypes.SUCCESS,
      },],
    }],
  },
}
export const RESPONSES = {
  'make': MAKE_RESPONSE
}