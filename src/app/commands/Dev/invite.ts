import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'

export default class Invite extends Command {
    static activated: boolean = true
    command: string = 'invite'
    desc: string = 'Invite the bot in your server'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = true
    aliases: string[] = []
    usage: string = 'invite'

    execute(context: Context, args: Arguments) {
        let embed = new RichEmbed()
            .setColor(context.getUserColor())
            .setFooter(context.translate('/misc/requestedBy', { user: context.executor.tag }), context.executor.displayAvatarURL)
            .addField('Invite URL', app.invite_url)
        context.reply('', embed)
    }

}
