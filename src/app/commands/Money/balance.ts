import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Balance extends Command {
    static activated: boolean = true
    command: string = 'balance'
    desc: string = 'View your balance.'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'user', type: 'text', required: false, usage: '@user' }
    ]
    allowDM: boolean = false

    execute(context: Context, args: Arguments) {
        let mention = context.message.mentions.members.first(),
            asked = mention ? mention : context.server.member(context.executor.id),
            balance = app.db.getUser(asked.guild.id, asked.id).get('balance').value()

        context.reply(context.translate('/commands/money/balance', { user: asked.displayName, balance }))
    }

}
