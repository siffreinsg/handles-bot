import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'
import * as dateFormat from 'dateformat'

export default class Userinfos extends Command {
    command: string = 'userinfos'
    desc: string = 'Get infos on an user.'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'user', type: 'text', required: false, usage: '@user' }
    ]

    execute(context: Context, args: Arguments) {
        let firstMention = context.message.mentions.members.first(),
            askedUser = firstMention ? firstMention : context.server.member(context.executor),
            roles = askedUser.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => role.name),
            registeredOn = askedUser.user.createdTimestamp,
            joinedOn = askedUser.joinedTimestamp
        if (roles.length < 1) roles = ['None']
        this.setDateFormat(context.server.id)

        let embed = new RichEmbed()
            .setColor(askedUser.displayHexColor)
            .setAuthor(askedUser.displayName + ' - @' + askedUser.user.tag, askedUser.user.avatarURL)
            .addField(app.translate('/commands/userinfos/status', context.server.id), app.translate('/misc/status/' + askedUser.presence.status, context.server.id), true)
            .addField(app.translate('/commands/userinfos/game', context.server.id), (askedUser.presence.game && askedUser.presence.game && askedUser.presence.game.name) || app.translate('/commands/userinfos/notPlaying', context.server.id), true)
            .addField(app.translate('/commands/userinfos/registeredOn', context.server.id), dateFormat(registeredOn, app.translate('/misc/dateFormat', context.server.id)))
            .addField(app.translate('/commands/userinfos/joinedOn', context.server.id), dateFormat(joinedOn, app.translate('/misc/dateFormat', context.server.id)))
            .addField(app.translate('/commands/userinfos/roles', context.server.id), roles.join(', '), true)
            .addField(app.translate('/commands/userinfos/userID', context.server.id), askedUser.id, true)
            .setFooter(app.translate('/misc/requestedBy', context.server.id, { user: context.executor.tag }), context.executor.displayAvatarURL)
            .setThumbnail(askedUser.user.displayAvatarURL)
        context.reply('', embed)
    }

    setDateFormat(sid) {
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
            dateFormat.i18n.dayNames[i] = app.translate('/misc/days/' + dateFormat.i18n.dayNames[i - 7].toLowerCase(), sid)
        }
        for (j = 12; j < 24; j++) {
            dateFormat.i18n.monthNames[j] = app.translate('/misc/months/' + dateFormat.i18n.monthNames[i - 12].toLowerCase(), sid)
        }
    }
}
