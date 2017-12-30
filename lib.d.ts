import ConsoleOutput from './src/node_modules/Gus/Kernel/Output/ConsoleOutput'
import Application from './src/node_modules/Gus/Kernel/Application'
import * as Discord from 'discord.js'

declare global {
    
    namespace Gus {
        interface CommandArgument {
            name: string
            type: 'text',
            required: boolean,
            usage: string,
        }
        interface SelectorMap {
            nameField: string,
            requiredField: string,
        }
        type CommandPermission = Discord.PermissionString
    }

    var app: Application
    var consoleOutput: ConsoleOutput
    namespace NodeJS {
        interface Global {
            app: Application
            consoleOutput: ConsoleOutput
        }
    }
    
}
