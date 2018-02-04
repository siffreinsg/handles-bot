import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import JoinHandler from '../../events/JoinHandler'

export default class Welcome extends Command {
    static activated: boolean = true
    command: string = 'welcome'
    desc: string = 'Manage the server\'s welcome message'
    permissions: Permission[] = [
        'MANAGE_GUILD',
        'MANAGE_CHANNELS'
    ]
    args: Argument[] = [
        { name: 'action', type: 'text', required: true, usage: 'action' },
        { name: 'welcome message', type: 'text', required: false, usage: 'welcome message' }
    ]
    allowDM: boolean = false
    aliases: string[] = ['setwelcome', 'join', 'setjoin']
    usage: string = 'setwelcome <status|toggle|title|body> <message>'

    execute(context: Context, args: Arguments) {
        context.delete()
        let action = args.get(0) + '',
            data = args.getAll()

        let status = app.db.getConfig(context.server.id).get('joinmsg.enabled', false).value()

        switch (action) {
            case 'status':
                context.executor.send(context.translate('/commands/setwelcome/status', { status: (status ? context.translate('/commands/setwelcome/enabled') : context.translate('/commands/setwelcome/disabled')) }))
                new JoinHandler(context.server.member(context.executor))
                break
            case 'toggle':
                app.db.getConfig(context.server.id).set('joinmsg.enabled', (status ? false : true)).write()
                context.reply(context.translate('/commands/setwelcome/toggled', { change: (status ? context.translate('/commands/setwelcome/disabled') : context.translate('/commands/setwelcome/enabled')) }))
                break
            case 'title':
                data.splice(0, 1)
                let title = data.join(' ')
                if (!title) return context.replyError('badArgs')

                app.db.getConfig(context.server.id).set('joinmsg.title', title).write()
                context.reply(context.translate('/commands/setwelcome/titleSet', { title }))
                break
            case 'body':
                data.splice(0, 1)
                let body = data.join(' ')
                if (!body) return context.replyError('badArgs')

                app.db.getConfig(context.server.id).set('joinmsg.body', body).write()
                context.reply(context.translate('/commands/setwelcome/bodySet', { body }))
                break
            default:
                return context.replyError('badArgs')
        }

    }
}