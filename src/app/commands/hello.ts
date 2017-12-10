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
        console.log(args)
        context.answer(this.textToSay(args))
    }
    
    textToSay(args: Arguments) {
        var name = args.getAll().join(' ') || app.translator._('/commands/helloworld/world')
        return app.translator._('/commands/helloworld/hello').replace('{who}', name)
    }
    
}
