import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as Levels from 'Handles/Utils/Levels'
import { RichEmbed } from 'discord.js'
import { xpToLVL } from 'Handles/Utils/Levels'

export default class Rank extends Command {
    static activated: boolean = true
    command: string = 'rank'
    desc: string = 'Check a user\'s level in the server.'
    permissions: Permission[] = []
    args: Argument[] = [
        { type: 'text', required: false }
    ]
    allowDM: boolean = false
    aliases: string[] = ['xp', 'level']
    usage: string = 'rank [@user]'

    execute(context: Context, args: Arguments) {
        let firstMention = context.message.mentions.members.first(),
            askedUser = firstMention ? firstMention : context.server.member(context.executor),
            user = app.db.getUser(context.server.id, context.executor.id).value(),
            users = app.db.getUsers(askedUser.guild.id).value()

        users.sort((a, b) => { return a.xp - b.xp })
        users.reverse()
        let position = users.findIndex(x => x.id === askedUser.id)

        let embed = new RichEmbed()
            .setColor(context.getUserColor(askedUser.id))
            .setAuthor(askedUser.displayName + ' - @' + askedUser.user.tag, askedUser.user.displayAvatarURL)
            .addField('Rank', (position + 1) + '/' + users.length, true)
            .addField('Level', Levels.xpToLVL(user.xp) + ' (Tot. XP: ' + user.xp + ')', true)
            .addField('XP', (user.xp - Levels.lvlToXP(Levels.xpToLVL(user.xp))) + '/' + (Levels.lvlToXP(Levels.xpToLVL(user.xp) + 1) - Levels.lvlToXP(Levels.xpToLVL(user.xp))), true)
        context.reply('', embed)
    }

}
