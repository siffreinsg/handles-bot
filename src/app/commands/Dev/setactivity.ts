import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Setactivity extends Command {
    static activated: boolean = true
    command: string = 'setactivity'
    desc: string = 'Set bot\'s activity'
    permissions: Permission[] = [
        'SUPER_ADMIN'
    ]
    args: Argument[] = [
        { name: 'activity', type: 'text', required: false, usage: 'activity' }
    ]
    allowDM: boolean = true
    aliases: string[] = ['activity', 'game', 'setgame']
    usage: string = 'setactivity <text>'

    execute(context: Context, args: Arguments) {
        let activity = args.get(0) ? args.getAll().join(' ') : app.config.activity.replace('{prefix}', app.config.prefix)
        app.client.user.setActivity(activity)
        context.reply(context.translate('/commands/setactivity'))
    }

}
