import Command from 'Gus/Command/CommandHandler'
import Context from 'Gus/Command/CommandContext'
import Arguments from 'Gus/Utils/Arguments'
import Argument = Gus.CommandArgument
import Permission = Gus.CommandPermission

export default class Hello extends Command
{
    command: string = 'hello'
    desc: string = 'Simple test command.'
    args : Argument[] = [
        {name: 'name', type: 'text', required: false, usage: 'Paul'}
    ]
    
    execute(context : Context, args: Arguments){
        var who = args.getAll().join(' ') || app.translate('/commands/helloworld/world')
        context.reply(app.translate('/commands/helloworld/hello', {who}))
    }
    
}
