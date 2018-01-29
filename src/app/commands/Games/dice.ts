import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import * as Utils from 'Handles/Utils/Misc'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Dice extends Command {
    static activated: boolean = true
    command: string = 'dice'
    desc: string = 'Dice game'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'amount', type: 'text', required: true, usage: 'amount' },
        { name: 'result', type: 'text', required: true, usage: 'result 1->6' }
    ]
    allowDM: boolean = false
    aliases: String[] = []

    execute(context: Context, args: Arguments) {
        let user = context.server.member(context.executor.id),
            account = app.db.getUser(user.guild.id, user.id),
            oldBalance = account.get('balance', 0).value(),
            amount = parseInt('' + args.get(0)),
            number = parseInt('' + args.get(1))

        if (amount < 10) return context.replyError('custom', context.translate('/commands/money/amountError'), context.translate('/commands/money/mustBeAmount'))
        if ((oldBalance - amount) < 0) return context.replyError('custom', context.translate('/commands/money/notEnoughMoney'), context.translate('/commands/money/cantBeNegative'))
        if (number > 6 || number < 1) return context.replyError('badArgs')

        account.set('balance', oldBalance - amount).write()

        let lucky = '' + Utils.getRandomInt(1, 6),
            tirage = '' + Utils.getRandomInt(1, 6),
            search = ['1', '2', '3', '4', '5', '6'],
            replacement = [
                '|       |\n|   o   |\n|       |\n',
                '|     o |\n|       |\n| o     |\n',
                '|     o |\n|   o   |\n| o     |\n',
                '| o   o |\n|       |\n| o   o |\n',
                '| o   o |\n|   o   |\n| o   o |\n',
                '| o   o |\n| o   o |\n| o   o |\n'
            ]

        let toSend = '---------\n' + Utils.replaceAll(tirage, search, replacement) + '---------\n\nLucky number: ' + lucky
        context.reply(toSend, { code: 'ldif' })

        toSend = ''
        let multiplier = 0
        if (tirage === number + '') {
            multiplier = 2.5
            toSend += context.translate('/commands/games/goodDice') + '\n'
        }
        if (lucky === tirage) {
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
