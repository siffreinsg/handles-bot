import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Hello extends Command {
    command: string = 'hello'
    desc: string = 'Simple test command.'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'name', type: 'text', required: false, usage: 'Paul' }
    ]
    allowDM: boolean = true

    execute(context: Context, args: Arguments) {
        var who = args.getAll().join(' ') || context.translate('/commands/hello/default')
        context.reply(context.translate('/commands/hello/hello', { who }))
    }

}
