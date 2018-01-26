import * as minimist from 'minimist'
import * as didYouMean from 'didyoumean2'
import * as Discord from 'discord.js'
import * as Command from 'Handles/Utils/Command'
// import User from 'Handles/DB/User'
import Stats from 'Handles/DB/Global'
import 'colors'


export default class MessageHandler {
    message: Discord.Message

    /**
     * Initialize the bot.
     */
    constructor(message: Discord.Message) {
        this.message = message
        var msg = message.content.toString(), user, stats
        /* if (this.message.channel.type === 'text' && this.message.guild) {
            stats = app.db.getStats(this.message.guild.id)
            user = new User(this.message.member)
        } */

        if (this.isCommand(msg)) {
            var { command, args } = this.parseCommand(msg)
            var answer = this.executeCommand(this.message, command, args)

            this.checkAnswer(answer, command)

            /* if (this.message.channel.type === 'text' && !this.message.author.bot) {
                 user.incrementCmdExed()
                 let commandsExecuted = stats.get('commandsExecuted').value()
                 stats.set('commandsExecuted', (commandsExecuted ? commandsExecuted : 0) + 1).write()
             } */
        } /* else if (this.message.channel.type === 'text') {
            let oldLevel = user.getLevel(),
                newXP = user.incrementXp(Math.floor(Math.random() * app.config.XPgived[1]) + app.config.XPgived[0]),
                newLevel = user.getLevel()
            user.incrementMsgSent()

            if (newLevel > oldLevel) {
                let lang = app.translator.defaultLang
                if (this.message.guild && this.message.guild.id) lang = app.translator.getServerLang(this.message.guild.id)
                this.message.channel.send(app.translator.translate('/events/MessageHandler/levelup', lang, { who: '<@' + this.message.author.id + '>', level: '' + newLevel }))
            }

            let messagesSent = stats.get('messagesSent').value()
            stats.set('messagesSent', (messagesSent ? messagesSent : 0) + 1).write()
        } */
    }

    parseCommand(command) {
        var command = command.split(' ')
        var args = minimist(command.slice(1))
        command = command[0].substring(1)
        return { command, args }
    }

    isCommand(command) {
        if (command.indexOf(app.config.prefix) === 0) {
            command = command.split(' ')[0].substring(1)
            return true
        }
        return false
    }

    executeCommand(message, command, args) {
        return Command.execute(message, command, args)
    }

    checkAnswer(answer, executedCommand) {
        let { author, guild, channel, content } = this.message,
            lang = app.translator.defaultLang
        if (guild && guild.id) lang = app.translator.getServerLang(guild.id)

        switch (answer) {
            case 'notfound':
                let recommended = didYouMean(executedCommand, app.commands.list, { returnType: 'first-closest-match' })
                this.message.channel.send(app.translator.translate('/errors/unknownCommand', lang) + (recommended ? app.translator.translate('/errors/didYouMean', lang, { command: recommended }) : '') + '\n' + app.translator.translate('/errors/useHelpCommand', lang))
                console.log((author.username + ' (@' + author.id + ') tried the inexistent command "' + content + '" in the server "' + this.message.guild.name + '" (ID:' + this.message.guild.id + ')').grey)
                break
            default:
                console.log((author.username + ' (@' + author.id + ') executed the command "' + content + '"' + (this.message.guild ? ' in the server "' + this.message.guild.name + '" (ID:' + this.message.guild.id + ')' : ' in DMs.')).gray)
                break
        }
    }
}
