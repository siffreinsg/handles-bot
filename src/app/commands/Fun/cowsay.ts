import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as cowsay from 'cowsay'

export default class Cowsay extends Command {
    static activated: boolean = true
    command: string = 'cowsay'
    desc: string = 'Let the cow say something'
    permissions: Permission[] = []
    args: Argument[] = [
        { type: 'text', required: true }
    ]
    props: {} = {
        '--eyes': String,
        '--tongue': String
    }
    allowDM: boolean = true
    aliases: string[] = []
    usage: string = 'cowsay <text> [--eyes=text] [--tongue=text]'

    execute(context: Context, args: Arguments) {
        let text = args.getAll().join(' '),
            e = args.getProp('--eyes'),
            T = args.getProp('--tongue')

        let toSend = cowsay.say({
            text, e, T
        })

        if (toSend.length > 1990) return context.replyError('badArgs')

        context.reply('```' + toSend + '```')
    }
}
