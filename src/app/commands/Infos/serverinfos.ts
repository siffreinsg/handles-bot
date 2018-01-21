import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'
import * as dateFormat from 'dateformat'

export default class Serverinfos extends Command {
    command: string = 'serverinfos'
    desc: string = 'Get infos on the server.'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = false


    execute(context: Context, args: Arguments) {
        let server = context.server
        if (!server.available) return context.replyError()

        this.setDateFormat(context.server.id)

        let embed = new RichEmbed()
            .setColor(server.member(context.executor).displayHexColor)
            .setAuthor(server.name, server.iconURL)
            .addField(app.translate('/commands/serverinfos/createdAt', server.id), dateFormat(server.createdTimestamp, app.translate('/misc/dateFormat', server.id), true))
            .addField(app.translate('/commands/serverinfos/owner', server.id), server.owner.user, true)
            .addField(app.translate('/commands/serverinfos/region', server.id), server.region, true)
            .addField(app.translate('/commands/serverinfos/members', server.id), server.members.filter(member => member.presence.status !== 'offline').size + '/' + server.memberCount, true)
            .addField(app.translate('/commands/serverinfos/defaultChannel', server.id), server.defaultChannel, true)
            .addField(app.translate('/commands/serverinfos/textChannel', server.id), server.channels.filter(m => m.type === 'text').size, true)
            .addField(app.translate('/commands/serverinfos/voiceChannel', server.id), server.channels.filter(m => m.type === 'voice').size, true)
            .addField(app.translate('/commands/serverinfos/roles', server.id), server.roles.size, true)
            .addField(app.translate('/commands/serverinfos/emojis', server.id), server.emojis.size, true)
            .setFooter(app.translate('/misc/requestedBy', server.id, { user: context.executor.tag }), context.executor.displayAvatarURL)
            .setThumbnail(server.iconURL)
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
