import { TICKET_RESPONSE } from './ticket.js'
import { DM_RESPONSE } from './dm.js'
import { ROLE_RESPONSE } from './roles.js'
import { BOOTH_RESPONSE } from './booth.js'


export const COMMAND_RESPONSES = {
  make:{
    ticket: TICKET_RESPONSE,
    roles: ROLE_RESPONSE,
    booth: BOOTH_RESPONSE,
  },
  dm: DM_RESPONSE
};