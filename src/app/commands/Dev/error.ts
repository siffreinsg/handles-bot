import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Error extends Command {
    command: string = 'error'
    desc: string = 'Generate an error of your choice.'
    args: Argument[] = [
        { name: 'error', type: 'text', required: true, usage: 'error' },
        { name: 'title', type: 'text', required: false, usage: 'title' },
        { name: 'desc', type: 'text', required: false, usage: 'desc' }
    ]

    execute(context: Context, args: Arguments) {
        context.replyError('' + args.get(0), '' + args.getProp('title'), '' + args.getProp('desc'))
    }

}
