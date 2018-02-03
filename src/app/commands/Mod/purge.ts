import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Purge extends Command {
    static activated: boolean = true
    command: string = 'purge'
    desc: string = 'Delete a lot of messages (/!\ dangerous /!\)'
    permissions: Permission[] = [
        'MANAGE_GUILD',
        'MANAGE_CHANNELS',
        'MANAGE_MESSAGES'
    ]
    args: Argument[] = [
        { name: 'quantity', type: 'text', required: true, usage: 'quantity' }
    ]
    allowDM: boolean = false
    aliases: string[] = ['delete']
    usage: string = 'purge <quantity>'

    execute(context: Context, args: Arguments) {
        let quantity = parseInt('' + args.get(0))
        if (quantity >= 2 && quantity <= 500) {
            context.channel.fetchMessages({ limit: quantity })
                .then(messages => {
                    context.reply(context.translate('/commands/purge/deleting')).then(function (msg: any) {
                        messages.deleteAll().forEach(promise => promise.catch(console.log))
                        msg.edit(context.translate('/commands/purge/msgDeleted')).then(m => m.delete(3000))
                    }).catch(console.log)
                }).catch(console.log)
        } else {
            context.replyError('custom', context.translate('/commands/purge/incorrectNumber'), context.translate('/commands/purge/mustBeInRange'))
        }
    }

}
