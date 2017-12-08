import * as fs from 'fs'
import * as path from 'path'
import * as Discord from 'discord.js'
import Recursive from './Recursive'

declare var global, app
export default class Commands {
    cmds = {}
    list : Array<string> = []
    cmdPath : string = '../app/commands/'

    constructor(){
        this.init()
    }

    /**
     * Initialize bot commands.
     */
    init(){
        this.cmdPath = path.resolve(__dirname, this.cmdPath)

        let cmds = this
        Recursive.folderlooper(this.cmdPath, function(dir, cmdFile){
            let fullFile = path.join(dir, cmdFile)
            cmds.load(fullFile)
        })
    }

    /**
     * Execute an command.
     * 
     * @param message Discord Message object of command
     * @param command Command name
     * @param args Arguments of command
     * 
     *
     */
    execute(message : Discord.Message, command : string, args : any){
        command = command.toLowerCase()
        if (this.list.indexOf(command) !== -1) {
            let availableArgs = this.cmds[command].args
            
            /* ROAD TO SOMETHING AHAH
            availableArgs.forEach(function (arg, index) {
                switch (arg.type){
                    case 'text':
                        if (typeof args._[index] != 'string') {
                            return 'error'
                        }
                        break;
                    case 'number':
                        break;
                }
            })*/

            return this.cmds[command].execute(args, message)
        } else {
            return 'notfound'
        }
    }

    filterFloat(value : any) {
        if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
          .test(value))
          return Number(value)
      return NaN
    }
    

    /**
     * Load a command from file.
     * 
     * @param filename Full path of the file
     */
    load(filename : string){
        if (filename.length > 4 && filename.indexOf('.js') > 0) {
            let command = require(filename).default
            this.cmds[command.command] = new command()
            this.list.push(command.command)
        }
    }
}
