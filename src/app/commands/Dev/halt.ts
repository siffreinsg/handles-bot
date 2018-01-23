import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Halt extends Command {
    command: string = 'halt'
    desc: string = 'Shutdown the bot'
    permissions: Permission[] = [
        'SUPER_ADMIN'
    ]
    args: Argument[] = []
    allowDM: boolean = true

    async execute(context: Context, args: Arguments) {
        await context.reply(context.translate('/commands/halt'))
        console.log('Shutting down !')
        process.exit(0)
    }
}
