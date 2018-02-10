import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Say extends Command {
    static activated: boolean = true
    command: string = 'say'
    desc: string = 'Make the bot say something.'
    permissions: Permission[] = [
        'MANAGE_MESSAGES'
    ]
    args: Argument[] = [
        { type: 'text', required: true },
        { type: 'text', required: false }
    ]
    props: {} = {}
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
