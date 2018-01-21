import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'

export default class Stats extends Command {
    command: string = 'stats'
    desc: string = 'NUMBERS ! Best thing of my life :3'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = false

    execute(context: Context, args: Arguments) {
        let stats = app.db.getStats(context.server.id)

        let embed = new RichEmbed()
            .setColor(context.server.member(context.executor).displayHexColor)
            .setAuthor(context.server.name, context.server.iconURL)
            .addField(app.translate('/commands/stats/msgSent', context.server.id), stats.get('messagesSent').value() + '/' + stats.get('messagesSent').value(), true)
            .addField(app.translate('/commands/stats/cmdExed', context.server.id), stats.get('commandsExecuted').value() + '/' + stats.get('commandsExecuted').value(), true)
            .setFooter(app.translate('/commands/stats/figuresFormat', context.server.id))
        context.reply('', embed)
    }

}
