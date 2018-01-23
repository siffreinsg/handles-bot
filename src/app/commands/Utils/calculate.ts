import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as math from 'math-expression-evaluator'
import { RichEmbed } from 'discord.js'

export default class Calculate extends Command {
    command: string = 'calculate'
    desc: string = 'Let\'s do some maths !'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'equation', type: 'text', required: true, usage: 'equation' }
    ]
    allowDM: boolean = true

    execute(context: Context, args: Arguments) {
        let equation = args.getAll().join(' ')

        try {
            let result = math.eval(equation),
                embed = new RichEmbed()
                    .setColor(context.getUserColor())
                    .setFooter(context.translate('/misc/requestedBy', { user: context.executor.tag }), context.executor.displayAvatarURL)
                    .addField(context.translate('/commands/calculate/equation'), '```' + equation + '```')
                    .addField(context.translate('/commands/calculate/result'), '```' + result + '```')
            context.reply('', embed)
        } catch (err) {
            return context.replyError('badArgs')
        }

    }

}
