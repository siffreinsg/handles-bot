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
    props: {} = {}
    args: Argument[] = [
        { type: 'text', required: true },
        { type: 'text', required: false }
    ]
    allowDM: boolean = false
    aliases: string[] = ['setwelcome', 'join', 'setjoin']
    usage: string = 'setwelcome <status|toggle|title|body> <message>'

    execute(context: Context, args: Arguments) {
        context.delete()
        let action = args.get(0) + '',
            data = args.getAll()

        let joinmsg = app.db.createIfNotExists(app.db.getConfig(context.server.id), 'joinmsg', { enabled: false, title: '', body: '' }),
            status = joinmsg.value().enabled

        switch (action) {
            case 'status':
                context.executor.send(context.translate('/commands/setwelcome/status', { status: (status ? context.translate('/commands/setwelcome/enabled') : context.translate('/commands/setwelcome/disabled')) }))
                new JoinHandler(context.server.member(context.executor))
                break
            case 'toggle':
                joinmsg.set('enabled', (status ? false : true)).write()
                context.reply(context.translate('/commands/setwelcome/toggled', { change: (status ? context.translate('/commands/setwelcome/disabled') : context.translate('/commands/setwelcome/enabled')) }))
                break
            case 'title':
                data.splice(0, 1)
                let title = data.join(' ')
                if (!title) return context.replyError('badArgs')

                joinmsg.set('title', title).write()
                context.reply(context.translate('/commands/setwelcome/titleSet', { title }))
                break
            case 'body':
                data.splice(0, 1)
                let body = data.join(' ')
                if (!body) return context.replyError('badArgs')

                joinmsg.set('body', body).write()
                context.reply(context.translate('/commands/setwelcome/bodySet', { body }))
                break
            default:
                return context.replyError('badArgs')
        }

    }
}
