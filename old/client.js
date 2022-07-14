// import nacl from 'tweetnacl'
import { verifyKey } from 'discord-interactions'
import { CommandManager } from './commands.js'
import { RequestManager } from './requester.js'
// import 
export class DiscordHTTPClient{
    /**
     * Simple Discord HTTP Client to handle outbound webhooks from Discord servers
     * in the form of Interactions
     * @param clientKey private Discord API Key
     * @param e AWS APIGatewayEvent
     */
    constructor(clientKey, e){
        this._clientKey = clientKey
        this._event = e
        this.request = new RequestManager(this)
        this.commands = new CommandManager(this)
    }
    /**
     * public method parses APIGatewayEvent to determine validity of HTTP request
     * @returns { Boolean } verification status of inbound request
     */
    _validateRequest(){
        let timestamp = this._event.headers['x-signature-timestamp'];
        let signature = this._event.headers['x-signature-ed25519']
        let req = this._event.body; // should be string, for successful sign
        if(!(timestamp && signature && req && this._clientKey))
            return false
        return verifyKey(
            Buffer.from(req),
            Buffer.from(signature,'hex'),
            Buffer.from(timestamp),
            Buffer.from(this._clientKey, 'hex')
        )
        // return nacl.sign.detached.verify(
        //     Buffer.from(timestamp + req),
        //     Buffer.from(signature, 'hex'),
        //     Buffer.from(this._clientKey, 'hex')
        // );
    }
    // GETTERS
    get _requestBody(){
        if(!this._event.body) return  undefined
        return JSON.parse(this._event.body)
    }
    get _appId(){
        if (!this._requestBody.application_id) return undefined
        return this._requestBody.application_id
    }
    get _guildId(){
        if (!this._requestBody.guild_id) return undefined
        return this._requestBody.guild_id
    }
    get _memberData(){ 
        if (!this._requestBody.member) return undefined
        return this._requestBody.member
    }
    get _data(){
        if(!this._requestBody.data) return
        return this._requestBody.data
    }
}
