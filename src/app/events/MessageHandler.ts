import * as minimist from 'minimist'
import * as didYouMean from 'didyoumean2'
import * as Discord from 'discord.js'
import * as Command from 'Handles/Utils/Command'
import User from 'Handles/DB/User'
import Stats from 'Handles/DB/Global'
import 'colors'


export default class MessageHandler {
    message : Discord.Message

    /**
     * Initialize the bot.
     */
    constructor(message: any){
        this.message = message
        var message = message.content.toString()
        let stats = app.db.getStats(this.message.guild.id)

        if (this.isCommand(message)) {
            var {command, args} = this.parseCommand(message)
            var answer = this.executeCommand(this.message, command, args)

            this.checkAnswer(answer, command)

            let commandsExecuted = stats.get('commandsExecuted').value()
            stats.set('commandsExecuted', (commandsExecuted ? commandsExecuted : 0) + 1)
        } else if (!this.message.author.bot) {
            let user = new User(this.message.member),
                oldLevel = user.getLevel(),
                newXP = user.incrementXp(Math.floor(Math.random() * app.config.XPgived[1]) + app.config.XPgived[0]),
                newLevel = user.getLevel()
            user.push()

            if (newLevel > oldLevel) {
                this.message.channel.send(app.translate('/events/MessageHandler/levelup', {who: '<@' + this.message.author.id + '>', level: '' + newLevel}))
            }

            let messagesSent = stats.get('messagesSent').value()
            stats.set('messagesSent', (messagesSent ? messagesSent : 0) + 1)
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
        return Command.execute(message, command, args)
    }
    
    checkAnswer(answer, executedCommand){
        let {author, channel, content} = this.message
        
        switch (answer) {
            case 'notfound':
                let recommended = didYouMean(executedCommand, app.commands.list, {returnType: 'first-closest-match'})
                this.message.channel.send(app.translate('/errors/unknownCommand') + (recommended ? app.translate('/errors/didYouMean', {command: recommended}) : '') + '\n' + app.translate('/errors/useHelpCommand'))
                console.log((author.username + ' (@' + author.id + ') tried the inexistent command "' + content + '" in the server "' + this.message.guild.name + '" (ID:' + this.message.guild.id + ')').grey)
                break
            case 'badargs':
                channel.sendMessage(app.translate('/errors/badArgs'))
                break
            default:
                console.log((author.username + ' (@' + author.id + ') executed the command "' + content + '" in the server "' + this.message.guild.name + '" (ID:' + this.message.guild.id + ')').gray)
                break
        }
    }
}
