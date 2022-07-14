import {ApplicationCommandTypes} from './utils/types.js'
import { RequestManager } from './requester.js'
import { ResponseManager } from './responder.js'
import {BaseManager} from './utils/manager.js'

export class CommandController extends BaseManager{
  constructor(interactor){
    super(interactor)
    this.request = new RequestManager(this._interactor)
    this.responder = new ResponseManager(this._interactor)
  }
  interactionHandler(){
    // console.log(this._interaction.isCommand())
    // console.log(this._interaction.isMessageComponent())
    // console.log(this._interaction.isModalSubmit())
    if(this._interaction.isCommand())
      return this.responder.commandResponse(this._interaction)
    if(this._interaction.isMessageComponent())
      return this.responder.componentResponse(this._interaction)
    if(this._interaction.isModalSubmit())
      return this.responder.modalResponse(this._interaction)
  }
  
}

