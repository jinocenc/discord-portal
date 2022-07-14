import fetch from 'node-fetch'
import {ENDPOINTS, DISCORD_URL} from './const.js'
import { BaseManager } from './util.js'

 export class RequestManager extends BaseManager{
    /**
     * HTTP request manager for DiscordHTTPClient
     * @param client Instantiated Client
     */
    constructor(client){
        super(client)
    }
    /**
     * Discord HTTP request helper
     * @param targetEndpoint target endpoint of discord API
     * @param options method (GET,POST,.. etc.)
     */
    async DiscordRequest(
        targetEndpoint, 
        options
        ){
        const ENDPOINT = ENDPOINTS[targetEndpoint](
            this.client._appId, 
            this.client._guildId
        )
        const URL = DISCORD_URL+ENDPOINT
        const res = await fetch(URL,{
            headers:{
                Authorization: `Bot ${this.client._clientKey}`,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            ...options
        })
        if(!res.ok){
            const data = await res.json()
            throw new Error(JSON.stringify(data))
        }
        return res
    }
}