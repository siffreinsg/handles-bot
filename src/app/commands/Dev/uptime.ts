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
        let embed = new RichEmbed()
            .setColor(context.getUserColor())
            .addField(':calendar: Uptime', ':clock1: ' + this.fancyTimeFormat(Math.floor((Date.now() - this.startTime) / 1000)))
        context.reply('', embed)
    }

    fancyTimeFormat(secs: number): string {
        let hours = ~~(secs / 3600),
            minutes = ~~((secs % 3600) / 60),
            seconds = secs % 60,
            ret = ''

        if (hours > 0) ret += '' + hours + ':' + (minutes < 10 ? '0' : '')
        ret += '' + minutes + ':' + (seconds < 10 ? '0' : '') + '' + seconds
        return ret
    }

}
