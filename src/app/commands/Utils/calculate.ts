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

    execute(context: Context, args: Arguments) {
        let equation = args.getAll().join(' ')

        try {
            let result = math.eval(equation),
                embed = new RichEmbed()
                    .setColor(context.executor.displayHexColor)
                    .setFooter(app.translate('/misc/requestedBy', context.server.id, { user: context.executor.user.tag }), context.executor.user.avatarURL)
                    .addField(app.translate('/commands/calculate/equation', context.server.id), '```' + equation + '```')
                    .addField(app.translate('/commands/calculate/result', context.server.id), '```' + result + '```')
            context.reply('', embed)
        } catch (err) {
            return context.replyError('badArgs')
        }

    }

}
