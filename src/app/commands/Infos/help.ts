import * as Discord from 'discord.js'
import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Help extends Command {
    static activated: boolean = true
    command: string = 'help'
    desc: string = ''
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'command', type: 'text', required: false, usage: 'command name' }
    ]
    allowDM: boolean = true

    execute(context, args) {
        if (args.get(0) !== 'list') {
            context.reply(context.translate('/commands/help/message'))
        } else {
            let toSend = context.translate('/commands/help/availableCommands')
            app.commands.list.forEach(function (cmd_name) {
                if (cmd_name !== 'help') {
                    var cmd = app.commands.cmds[cmd_name]
                    toSend += '\n    - `' + app.config.prefix + cmd.command + '` -- ' + cmd.desc
                }
            })
            toSend += '\n\n' + context.translate('/commands/help/fullList')
            context.reply(toSend + '\.', { split: true })
        }
    }
}
