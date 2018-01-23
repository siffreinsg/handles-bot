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
            seconds: any = parseInt('' + (msec / 1000) % 60),
            minutes: any = parseInt('' + (msec / (1000 * 60)) % 60),
            hours: any = parseInt('' + (msec / (1000 * 60 * 60)) % 24)

        hours = (hours < 10) ? '0' + hours : hours
        minutes = (minutes < 10) ? '0' + minutes : minutes
        seconds = (seconds < 10) ? '0' + seconds : seconds

        let reply = hours + ':' + minutes + ':' + seconds,
            embed = new RichEmbed()
                .setColor(context.getUserColor())
                .addField(':calendar: Uptime', ':clock1: ' + reply)
        context.reply('', embed)
    }

}
