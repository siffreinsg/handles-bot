import * as Discord from 'discord.js'
import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Help extends Command {
    command: string = 'help'
    desc: string = ''
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'command', type: 'text', required: false, usage: 'command name' }
    ]
    allowDM: boolean = true

    execute(context, args) {
        if (args.get(0) !== 'list') {
            context.reply(app.translate('/commands/help/message', context.server.id))
        } else {
            let toSend = app.translate('/commands/help/availableCommands', context.server.id)
            app.commands.list.forEach(function (cmd_name) {
                if (cmd_name !== 'help') {
                    var cmd = app.commands.cmds[cmd_name]
                    toSend += '\n    - `' + app.config.prefix + cmd.command + '` • ' + cmd.desc
                }
            })
            toSend += '\n\n' + app.translate('/commands/help/fullList', context.server.id)
            context.reply(toSend + '\.')
        }
    }
}
