import * as fs from 'fs'
import * as path from 'path'
import * as Discord from 'discord.js'
import * as Recursive from '../../Utils/Recursive'

declare var global, app
export default class Commands {
    cmds = {}
    list : Array<string> = []
    cmdPath : string = '../../../../app/commands/'

    constructor(){
        this.initCommands()
    }

    /**
     * Initialize bot commands.
     */
    initCommands(){
        this.cmdPath = path.resolve(__dirname, this.cmdPath)

        Recursive.loopFolders(this.cmdPath, (dir, cmdFile) => {
            let fullFile = path.join(dir, cmdFile)
            this.loadCommand(fullFile)
        })
    }

    /**
     * Execute an command.
     * 
     * @param message Discord Message object of command
     * @param command Command name
     * @param args Arguments of command
     */
    executeCommand(message : Discord.Message, command : string, args : any){
        command = command.toLowerCase()
        if (this.list.indexOf(command) !== -1) {
            return this.cmds[command].execute(args, message)
        } else {
            return 'notfound'
        }
    }


    

    /**
     * Load a command from file.
     * 
     * @param filename Full path of the file
     */
    loadCommand(filename : string){
        if (filename.length > 4 && filename.indexOf('.js') > 0) {
            let CommandClass = require(filename).default
            let command = new CommandClass()
            this.cmds[command.command] = command
            this.list.push(command.command)
        }
    }
}
