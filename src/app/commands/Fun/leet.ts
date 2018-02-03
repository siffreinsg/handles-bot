import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'
import { convert } from 'leet'

export default class leet extends Command {
    static activated: boolean = true
    command: string = 'leet'
    desc: string = 'Leet translator.'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'message', type: 'text', required: true, usage: 'message' }
    ]
    allowDM: boolean = true
    aliases: string[] = []
    usage: string = 'leet <text>'

    execute(context: Context, args: Arguments) {
        let embed = new RichEmbed()
            .setColor(context.getUserColor())
            .setFooter(context.translate('/misc/requestedBy', { user: context.executor.tag }), context.executor.displayAvatarURL)
            .addField('Translated', convert(args.getAll().join(' ')))
        context.reply('', embed)
    }

}
