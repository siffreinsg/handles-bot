import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Hello extends Command
{
    command: string = 'hello'
    desc: string = 'Simple test command.'
    args : Argument[] = [
        {name: 'name', type: 'text', required: false, usage: 'Paul'}
    ]
    
    execute(context : Context, args: Arguments){
        var who = args.getAll().join(' ') || app.translate('/commands/hello/default', context.server.id)
        context.reply(app.translate('/commands/hello/hello', context.server.id, {who}))
    }
    
}
