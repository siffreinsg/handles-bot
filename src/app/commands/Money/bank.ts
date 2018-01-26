import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as Discord from 'discord.js'
import UserDB from 'Handles/DB/User'

export default class Bank extends Command {
    command: string = 'bank'
    desc: string = 'Money power'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'action', type: 'text', required: true, usage: 'faucet|give|remove' }
    ]
    allowDM: boolean = false

    execute(context: Context, args: Arguments) {
        let mention = context.message.mentions.members.first(),
            asked = mention ? mention : context.server.member(context.executor.id),
            user = new UserDB(asked),
            action = args.get(0),
            newBalance, quantity

        switch (action) {
            case 'faucet':
                newBalance = user.incrementBalance(Math.floor(75 * ((100 + 2 * user.getLevel()) / 100)))
                context.reply('New balance of ' + asked.displayName + ': ' + newBalance + '€')
                break
            case 'give':
                if (!context.isAdmin()) return context.replyError('notAdmin')
                quantity = parseInt('' + args.get(1))
                if (!quantity) return context.replyError('badArgs')
                newBalance = user.incrementBalance(quantity)
                context.reply('New balance of ' + asked.displayName + ': ' + newBalance + '€')
                break
            case 'remove':
                if (!context.isAdmin()) return context.replyError('notAdmin')
                quantity = parseInt('' + args.get(1))
                if (!quantity) return context.replyError('badArgs')
                newBalance = user.incrementBalance(0 - quantity)
                context.reply('New balance of ' + asked.displayName + ': ' + newBalance + '€')
                break
            default:
                context.replyError('badArgs')
                break
        }

    }

}
