import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'

export default class Stats extends Command {
    static activated: boolean = true
    command: string = 'stats'
    desc: string = 'NUMBERS ! Best thing of my life :3'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = false

    execute(context: Context, args: Arguments) {
        let stats = app.db.getStats(context.server.id)

        let embed = new RichEmbed()
            .setColor(context.getUserColor())
            .setAuthor(context.server.name, context.server.iconURL)
            .addField(context.translate('/commands/stats/msgSent'), stats.get('messagesSent').value() + '/' + stats.get('messagesSent').value(), true)
            .addField(context.translate('/commands/stats/cmdExed'), stats.get('commandsExecuted').value() + '/' + stats.get('commandsExecuted').value(), true)
            .setFooter(context.translate('/commands/stats/figuresFormat'))
        context.reply('', embed)
    }

}
