import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'
import * as dateFormat from 'dateformat'

export default class Userinfos extends Command {
    static activated: boolean = true
    command: string = 'userinfos'
    desc: string = 'Get infos on an user.'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'user', type: 'text', required: false, usage: '@user' }
    ]
    allowDM: boolean = false
    aliases: String[] = ['user']

    execute(context: Context, args: Arguments) {
        let firstMention = context.message.mentions.members.first(),
            askedUser = firstMention ? firstMention : context.server.member(context.executor),
            roles = askedUser.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => role.name),
            registeredOn = askedUser.user.createdTimestamp,
            joinedOn = askedUser.joinedTimestamp
        if (roles.length < 1) roles = ['None']
        this.setDateFormat(context)

        let embed = new RichEmbed()
            .setColor(context.getUserColor(askedUser.id))
            .setAuthor(askedUser.displayName + ' - @' + askedUser.user.tag, askedUser.user.avatarURL)
            .addField(context.translate('/commands/userinfos/status'), context.translate('/misc/status/' + askedUser.presence.status), true)
            .addField(context.translate('/commands/userinfos/game'), (askedUser.presence.game && askedUser.presence.game && askedUser.presence.game.name) || context.translate('/commands/userinfos/notPlaying'), true)
            .addField(context.translate('/commands/userinfos/registeredOn'), dateFormat(registeredOn, context.translate('/misc/dateFormat')), true)
            .addField(context.translate('/commands/userinfos/joinedOn'), dateFormat(joinedOn, context.translate('/misc/dateFormat')), true)
            .addField(context.translate('/commands/userinfos/roles'), roles.join(', '), true)
            .addField(context.translate('/commands/userinfos/userID'), askedUser.id, true)
            .setFooter(context.translate('/misc/requestedBy', { user: context.executor.tag }), context.executor.displayAvatarURL)
            .setThumbnail(askedUser.user.displayAvatarURL)
        context.reply('', embed)
    }

    setDateFormat(context) {
        dateFormat.i18n = {
            dayNames: [
                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
            ],
            monthNames: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
            ],
            timeNames: [
                'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
            ]
        }

        let i, j
        for (i = 7; i < 14; i++) {
            dateFormat.i18n.dayNames[i] = context.translate('/misc/days/' + dateFormat.i18n.dayNames[i - 7].toLowerCase())
        }
        for (j = 12; j < 24; j++) {
            dateFormat.i18n.monthNames[j] = context.translate('/misc/months/' + dateFormat.i18n.monthNames[i - 12].toLowerCase())
        }
    }
}
