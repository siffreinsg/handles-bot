import * as minimist from 'minimist'
import * as didYouMean from 'didyoumean2'
import * as Discord from 'discord.js'
import * as Command from 'Gus/Utils/Command'
import User from 'Gus/DB/User'
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
        } else if (!this.message.author.bot) {
            /*
            Equations :
            X = 25 * lvl * lvl - 25 * lvl
            L = Math.floor(25 + Math.sqrt(625 + 100 * xp)) / 50
            */

            let user = new User(this.message.member),
                oldLevel = user.getLevel(),
                newXP = user.incrementXp(Math.floor(Math.random() * 10) + 0),
                newLevel = user.getLevel()
            user.push()

            if (newLevel > oldLevel) {
                this.message.channel.send(app.translate('/events/MessageHandler/levelup', {who: '<@' + this.message.author.id + '>', level: '' + newLevel}))
            }
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
