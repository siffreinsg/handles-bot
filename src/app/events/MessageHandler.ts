import * as arg from 'arg'
import * as didYouMean from 'didyoumean2'
import * as Discord from 'discord.js'
import * as Command from 'Handles/Utils/Command'
import * as Levels from 'Handles/Utils/Levels'
import 'colors'


export default class MessageHandler {
    message: Discord.Message

    /**
     * Initialize the bot.
     */
    constructor(message: Discord.Message) {
        this.message = message
        let msg = message.content.toString(),
            isCommand = this.isCommand(msg)

        if (isCommand) {
            let { command, args } = this.parseCommand(msg)
            let answer = this.executeCommand(this.message, command, args)
            this.checkAnswer(answer, command)
        }

        if (!this.message.author.bot) {
            let toIncrement = isCommand ? 'cmdExed' : 'msgSent'

            if (this.message.guild && this.message.guild.id) {
                let user = app.db.getUser(this.message.guild.id, this.message.author.id),
                    stats = app.db.getStats(this.message.guild.id),
                    res1 = stats.get(toIncrement, 0).value(),
                    res2 = user.get('stats.' + toIncrement, 0).value()

                stats.set(toIncrement, res1 + 1).write()
                user.set('stats.' + toIncrement, res2 + 1).write()

                let lang = app.translator.getServerLang(this.message.guild.id), xpToGive = 0
                if (res2 === 0) {
                    this.message.channel.send(app.translator.translate('/events/MessageHandler/first_' + toIncrement, lang, { who: '<@' + this.message.author.id + '>' }))
                    xpToGive += 100
                }

                if (!isCommand || xpToGive > 0) {
                    let oldXP = user.get('xp', 0).value(),
                        newLevel = Levels.xpToLVL(oldXP + xpToGive)

                    if (!isCommand) xpToGive += Math.floor(Math.random() * app.config.XPgived[1]) + app.config.XPgived[0]

                    user.set('xp', parseInt('' + oldXP) + xpToGive).write()
                    if (newLevel > Levels.xpToLVL(oldXP)) {
                        this.message.channel.send(app.translator.translate('/events/MessageHandler/levelup', lang, { who: '<@' + this.message.author.id + '>', level: '' + newLevel }))
                    }
                }
            }
            let globalStats = app.db.getGlobalStats(),
                res = globalStats.get(toIncrement, 0).value()
            globalStats.set(toIncrement, res + 1).write()
        }
    }

    parseCommand(command) {
        let data = command.split(' ')
        command = data[0].substring(1)


        let propsOptions = {}
        if (app.commands.list.indexOf(command) !== -1 || app.commands.aliases[command]) {
            let alias = app.commands.aliases[command]

            propsOptions = alias ? app.commands.cmds[alias].props : app.commands.cmds[command].props
        }

        let args = { _: [] }
        try {
            args = arg(data.slice(1), propsOptions)
        } catch (ex) {
            2 + 2 // = 4
        }
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
