import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'
import { convert } from 'leet'

export default class Binary extends Command {
    static activated: boolean = true
    command: string = 'binary'
    desc: string = 'Binary translator.'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'message', type: 'text', required: true, usage: 'message' }
    ]
    allowDM: boolean = true

    execute(context: Context, args: Arguments) {
        let embed = new RichEmbed()
            .setColor(context.getUserColor())
            .setFooter(context.translate('/misc/requestedBy', { user: context.executor.tag }), context.executor.displayAvatarURL)
            .addField('Translated', this.textToBin(args.getAll().join(' ')))
        context.reply('', embed)
    }

    textToBin(text: string) {
        return (
            Array
                .from(text)
                .reduce((acc: any, char: any) => acc.concat(char.charCodeAt().toString(2)), [])
                .map(bin => '0'.repeat(8 - bin.length) + bin)
                .join(' ')
        )
    }

}
