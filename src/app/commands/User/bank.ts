import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as Discord from 'discord.js'
import * as Levels from 'Handles/Utils/Levels'
import { fancyTimeFormat } from 'Handles/Utils/Converter'

export default class Bank extends Command {
    static activated: boolean = true
    command: string = 'bank'
    desc: string = 'Money power'
    permissions: Permission[] = []
    args: Argument[] = [
        { type: 'text', required: true }
    ]
    props: {} = {}
    allowDM: boolean = false
    aliases: string[] = []
    usage: string = 'bank <faucet|give|remove> [quantity] [@user]'

    execute(context: Context, args: Arguments) {
        let action = args.get(0),
            mention = context.message.mentions.members.first(),
            newBalance, quantity, gived, user

        if (action !== 'faucet') user = mention ? mention : context.server.member(context.executor.id)
        else user = context.server.member(context.executor.id)

        let userdb = app.db.getUser(user.guild.id, user.id),
            currentBalance = app.db.createIfNotExists(userdb, 'balance', 0).value(),
            timestamps = app.db.createIfNotExists(userdb, 'timestamps', { faucet: 0 }),
            timestamp = timestamps.get('faucet', 0).value()

        switch (action) {
            case 'faucet':
                let remaining = Date.now() - timestamp
                if (remaining < app.config.faucetCooldown * 60000) return context.replyError('custom', context.translate('/commands/money/cooldownErr'), context.translate('/commands/money/cooldown', { minutes: app.config.faucetCooldown, remaining: fancyTimeFormat((app.config.faucetCooldown * 60) - Math.floor(remaining / 1000)) }))

                gived = Math.floor(75 * ((100 + 2 * Levels.xpToLVL(userdb.get('xp', 0).value())) / 100))
                newBalance = currentBalance + gived
                userdb.set('balance', newBalance).write()
                timestamps.set('faucet', Date.now()).write()
                context.reply(context.translate('/commands/money/givedFaucet', { gived, newBalance }))
                break
            case 'give':
                if (!context.isAdmin()) return context.replyError('notAdmin')
                quantity = parseInt('' + args.get(1))
                if (!quantity) return context.replyError('badArgs')
                newBalance = currentBalance + quantity
                userdb.set('balance', newBalance).write()
                context.reply(context.translate('/commands/money/givedMoney', { user: user.displayName, quantity, newBalance }))
                break
            case 'remove':
                if (!context.isAdmin()) return context.replyError('notAdmin')
                quantity = parseInt('' + args.get(1))
                if (!quantity) return context.replyError('badArgs')
                newBalance = currentBalance - quantity
                userdb.set('balance', newBalance).write()
                context.reply(context.translate('/commands/money/removedMoney', { user: user.displayName, quantity, newBalance }))
                break
            default:
                context.replyError('badArgs')
                break
        }

    }

}
