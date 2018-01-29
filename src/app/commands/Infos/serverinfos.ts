import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'
import * as dateFormat from 'dateformat'

export default class Serverinfos extends Command {
    static activated: boolean = true
    command: string = 'serverinfos'
    desc: string = 'Get infos on the server.'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = false
    aliases: String[] = ['server']

    execute(context: Context, args: Arguments) {
        let server = context.server
        if (!server.available) return context.replyError()

        this.setDateFormat(context)

        let embed = new RichEmbed()
            .setColor(context.getUserColor())
            .setAuthor(server.name, server.iconURL)
            .addField(context.translate('/commands/serverinfos/createdAt'), dateFormat(server.createdTimestamp, context.translate('/misc/dateFormat'), true))
            .addField(context.translate('/commands/serverinfos/owner'), server.owner.user, true)
            .addField(context.translate('/commands/serverinfos/region'), server.region, true)
            .addField(context.translate('/commands/serverinfos/members'), server.members.filter(member => member.presence.status !== 'offline').size + '/' + server.memberCount, true)
            .addField(context.translate('/commands/serverinfos/textChannel'), server.channels.filter(m => m.type === 'text').size, true)
            .addField(context.translate('/commands/serverinfos/voiceChannel'), server.channels.filter(m => m.type === 'voice').size, true)
            .addField(context.translate('/commands/serverinfos/roles'), server.roles.size, true)
            .addField(context.translate('/commands/serverinfos/emojis'), server.emojis.size, true)
            .setFooter(context.translate('/misc/requestedBy', { user: context.executor.tag }), context.executor.displayAvatarURL)
            .setThumbnail(server.iconURL)
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
