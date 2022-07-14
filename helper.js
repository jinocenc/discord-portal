import {installGuildCommand} from './commands.js'
import {COMMANDS} from './commands.js'

installGuildCommand(process.env.APPLICATION_ID, process.env.GUILD_ID, COMMANDS['make'])