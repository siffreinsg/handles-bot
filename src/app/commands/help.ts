import * as Discord from 'discord.js'
import Command from 'Gus/Command/CommandHandler'
import Context from 'Gus/Command/CommandContext'
import Arguments from 'Gus/Utils/Arguments'
import Argument = Gus.CommandArgument
import Permission = Gus.CommandPermission

export default class Help extends Command
{
    public command : string = 'help'
    public desc : string = ''
    public args : Argument[] = [
        {name: 'command', type: 'text', required: false, usage: 'command name'} 
    ]
    
    execute(context, args){
        if (args.get(0) !== 'list') {
            context.answer(app.translator._('/commands/help/message'))
        } else {
            let toSend = app.translator._('/commands/help/available')
            app.commands.list.forEach(function (cmd_name) {
                if (cmd_name !== 'help') {
                    var cmd = app.commands.cmds[cmd_name]
                    toSend += '\n    - `' + app.config.prefix + cmd.command + '` • ' + cmd.desc 
                }
            })
            toSend += '\n\n' + app.translator._('/commands/help/fullist')
            context.answer(toSend + '\.')
        }
    }
}
