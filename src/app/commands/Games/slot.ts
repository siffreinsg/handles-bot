import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import * as Utils from 'Handles/Utils/Misc'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Slot extends Command {
    static activated: boolean = true
    command: string = 'slot'
    desc: string = 'Slot game'
    permissions: Permission[] = []
    args: Argument[] = [
        { type: 'text', required: true }
    ]
    allowDM: boolean = false
    aliases: string[] = []
    usage: string = 'slot <amount to bet>'

    execute(context: Context, args: Arguments) {
        let user = context.server.member(context.executor.id),
            account = app.db.getUser(user.guild.id, user.id),
            oldBalance = app.db.createIfNotExists(account, 'balance', 0).value(),
            amount = parseInt('' + args.get(0))

        if (amount < 10) return context.replyError('custom', context.translate('/commands/money/amountError'), context.translate('/commands/money/mustBeAmount'))
        if ((oldBalance - amount) < 0) return context.replyError('custom', context.translate('/commands/money/notEnoughMoney'), context.translate('/commands/money/cantBeNegative'))

        account.set('balance', oldBalance - amount).write()

        let lucky = Utils.getRandomInt(1, 12),
            tirage: Array<number> = [], i, toSend,
            search = ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            replacement = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:']

        for (i = 0; i < 9; i++) tirage[i + 1] = Utils.getRandomInt(1, 9)

        toSend = context.translate('/commands/games/drawn') + '\n\n        ' + tirage[1] + tirage[2] + tirage[3] + '\n:arrow_forward: ' + tirage[4] + (lucky === 12 ? ':four_leaf_clover:' : tirage[5]) + tirage[6] + ' :arrow_backward:\n        ' + tirage[7] + tirage[8] + tirage[9] + '\n\n'
        toSend = Utils.replaceAll(toSend, search, replacement)
        context.reply(toSend)

        toSend = ''
        let multiplier = 0
        switch (true) {
            case ((tirage[4] === tirage[5] || tirage[5] === tirage[6] || tirage[4] === tirage[6]) && !Utils.areEqual(tirage[4], tirage[5], tirage[6])):
                multiplier = 1.5
                toSend += context.translate('/commands/games/twoNums') + '\n'
                break
            case (Utils.areEqual(tirage[4], tirage[5], tirage[6])):
                multiplier = 2.5
                toSend += context.translate('/commands/games/threeNums') + '\n'
                break
            case (tirage[4] === (tirage[5] - 1) && tirage[5] === (tirage[6] - 1)):
                multiplier = 3.5
                toSend += context.translate('/commands/games/seriesOfNums') + '\n'
                break
        }
        if (lucky === 12) {
            multiplier += 1.5
            toSend += context.translate('/commands/games/lucky') + '\n'
        }
        if (toSend.length > 0) context.reply(toSend)

        if (multiplier !== 0) {
            let earnings = amount * multiplier,
                newBalance = oldBalance + earnings
            account.set('balance', newBalance).write()
            toSend = context.translate('/commands/games/goodresult', { amount: amount + '', multiplier: multiplier + '', earnings: earnings + '', newBalance: newBalance + '' })
        } else {
            toSend = context.translate('/commands/games/noEarnings')
        }
        context.reply(toSend, { code: 'ldif' })

    }


}
