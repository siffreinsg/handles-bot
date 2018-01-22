import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'


export default class Uptime extends Command {
    command: string = 'uptime'
    desc: string = 'Am I on time ?'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = true
    startTime = Date.now()

    execute(context: Context, args: Arguments) {
        let msec = Date.now() - this.startTime,
            days = Math.floor(msec / 1000 / 60 / 60 / 24),
            hours = Math.floor(msec / 1000 / 60 / 60),
            mins = Math.floor(msec / 1000 / 60),
            secs = Math.floor(msec / 1000),
            toReply = ':clock1: '

        if (days > 0) toReply += days + ' days '
        if (hours > 0) toReply += hours + ' hours '
        if (mins > 0) toReply += mins + ' minutes '
        if (secs > 0) toReply += secs + ' seconds '

        let embed = new RichEmbed()
            .setColor(context.server.member(app.client.user.id).displayHexColor)
            .addField(':calendar: Uptime', toReply)
        context.reply('', embed)
    }

}
