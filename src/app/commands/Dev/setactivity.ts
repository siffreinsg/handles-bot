import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Setactivity extends Command {
    command: string = 'setactivity'
    desc: string = 'Set bot\'s activity'
    permissions: Permission[] = [
        'SUPER_ADMIN'
    ]
    args: Argument[] = [
        { name: 'activity', type: 'text', required: true, usage: 'activity' }
    ]
    allowDM: boolean = true

    execute(context: Context, args: Arguments) {
        let status = args.getAll().join(' ')
        app.client.user.setActivity(status)
        context.reply(app.translate('/commands/setactivity', context.server.id))
    }

}
