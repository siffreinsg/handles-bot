import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import UserDB from 'Handles/DB/User'

export default class Balance extends Command {
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
            user = new UserDB(asked)

        context.reply('Balance of ' + asked.displayName + ': ' + user.balance + '€')
    }

}
