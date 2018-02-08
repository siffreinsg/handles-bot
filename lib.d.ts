import ConsoleOutput from './src/node_modules/Handles/Kernel/Output/ConsoleOutput'
import Application from './src/node_modules/Handles/Kernel/Application'
import * as Discord from 'discord.js'

declare global {

    namespace Handles {
        interface CommandArgument {
            type: 'text',
            required: boolean,
        }
        interface SelectorMap {
            nameField: string,
            requiredField: string,
        }
        type CommandPermission = Discord.PermissionString | 'SUPER_ADMIN'
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
