import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Say extends Command {
    command: string = 'say'
    desc: string = 'Let me speak'
    args: Argument[] = [
        { name: 'message', type: 'text', required: true, usage: 'text to say' },
        { name: 'options', type: 'text', required: false, usage: 'options' }
    ]

    execute(context: Context, args: Arguments) {
        context.message.delete().then(msg => {
            let toSend = args.getAll().join(' ').split('|'),
                message = toSend[0],
                options = toSend[1] ? toSend[1] : {}
            context.reply(message, options)
        })

    }
}
