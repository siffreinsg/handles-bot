import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Say extends Command {
    static activated: boolean = true
    command: string = 'say'
    desc: string = 'Let me speak'
    permissions: Permission[] = [
        'MANAGE_MESSAGES'
    ]
    args: Argument[] = [
        { name: 'message', type: 'text', required: true, usage: 'text to say' },
        { name: 'options', type: 'text', required: false, usage: '|options:{}' }
    ]
    allowDM: boolean = false
    aliases: string[] = ['echo']
    usage: string = 'say <text>'

    execute(context: Context, args: Arguments) {
        context.delete()
        let toSend = args.getAll().join(' ').split('|options='),
            message = toSend[0],
            options = toSend[1] ? toSend[1] : '{}'

        if (!message.includes('?say')) {
            context.reply(message, JSON.parse(options))
        } else {
            context.reply(context.translate('/errors/sayception'))
        }

    }
}
