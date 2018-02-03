import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'
import { fancyTimeFormat } from 'Handles/Utils/Converter'

export default class Uptime extends Command {
    static activated: boolean = true
    command: string = 'uptime'
    desc: string = 'Am I on time ?'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = true
    aliases: string[] = []
    usage: string = 'uptime'

    startTime = Date.now()

    execute(context: Context, args: Arguments) {
        let embed = new RichEmbed()
            .setColor(context.getUserColor())
            .addField(':calendar: Uptime', ':clock1: ' + fancyTimeFormat(Math.floor((Date.now() - this.startTime) / 1000)))
        context.reply('', embed)
    }
}
