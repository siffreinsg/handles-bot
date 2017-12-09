import * as minimist from 'minimist'
import * as didYouMean from 'didyoumean2'
import * as Discord from 'discord.js'
import 'colors'

export default class MessageHandler {
    message : Discord.Message

    /**
     * Initialize the bot.
     */
    constructor(message: any){
        this.message = message
        var message = message.content.toString()

        if (this.isCommand(message)) {
            var {command, args} = this.parseCommand(message)
            var answer = this.executeCommand(this.message, command, args)

            this.checkAnswer(answer, command)
        }
    }
	    
    parseCommand(command){
        var command = command.split(' ')
        var args = minimist(command.slice(1))
        command = command[0].substring(1)
        return {command, args}
    }

    isCommand(command){
        if (command.indexOf(app.config.prefix) === 0) {
            command = command.split(' ')[0].substring(1)
            return true
        }
        return false
    }
    
    executeCommand(message, command, args){
        return app.commands.executeCommand(message, command, args)
    }
    
    checkAnswer(answer, executedCommand){
        let {author, channel, content} = this.message
        
        switch (answer) {
            case 'notfound':
                let recommended = didYouMean(executedCommand, app.commands.list, {returnType: 'first-closest-match'})
                this.message.channel.send(app.translator._('/errors/unknownCommand') + (recommended ? app.translator._('/errors/didyoumean').replace('{command}', recommended) : '') + '\n' + app.translator._('/errors/useHelpCMD'))
                console.log((author.username + ' (@' + author.id + ') tried the inexistent command "' + content + '" in the server "' + this.message.guild.name + '" (ID:' + this.message.guild.id + ')').grey)
                break
            case 'badargs':
                channel.sendMessage(app.translator._('/errors/badargs'))
                break
            default:
                console.log((author.username + ' (@' + author.id + ') executed the command "' + content + '" in the server "' + this.message.guild.name + '" (ID:' + this.message.guild.id + ')').gray)
                break
        }
    }
}
