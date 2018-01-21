import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { Message } from 'discord.js'

export default class Purge extends Command {
    command: string = 'purge'
    desc: string = 'Delete a lot of messages (/!\ dangerous /!\)'
    permissions: Permission[] = [
        'MANAGE_GUILD',
        'MANAGE_CHANNELS'
    ]
    args: Argument[] = [
        { name: 'quantity', type: 'text', required: true, usage: 'quantity' }
    ]

    execute(context: Context, args: Arguments) {
        let quantity = parseInt('' + args.get(0))
        if (quantity >= 2 && quantity <= 500) {
            context.channel.fetchMessages({ limit: quantity })
                .then(messages => {
                    context.reply(app.translate('/commands/purge/deleting')).then(function (msg: any) {
                        messages.deleteAll().forEach(promise => promise.catch(console.log))
                        msg.edit(app.translate('/commands/purge/msgDeleted'))
                    })
                })
                .catch(console.log)
        } else {
            context.replyError('custom', app.translate('/commands/purge/incorrectNumber'), app.translate('/commands/purge/mustBeInRange'))
        }
    }

}
