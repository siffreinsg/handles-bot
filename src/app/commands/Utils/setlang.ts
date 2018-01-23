import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class SetLang extends Command {
    command: string = 'setlang'
    desc: string = 'Change server lang'
    permissions: Permission[] = [
        'MANAGE_GUILD',
        'MANAGE_CHANNELS'
    ]
    args: Argument[] = [
        { name: 'lang', type: 'text', required: true, usage: 'lang' }
    ]
    allowDM: boolean = false

    execute(context: Context, args: Arguments) {
        let lang = '' + args.get(0)
        if (lang === 'default') lang = 'en_US'
        let langs = Object.keys(app.translator.langs)

        if (langs.indexOf(lang) !== -1) {
            app.db.getConfig(context.server.id).set('lang', lang).write()
            context.reply(context.translate('/commands/langs/langSet', { lang }))
        } else {
            let availables = langs.join(', ') + ', default (en_US)'
            context.replyError('custom', context.translate('/commands/langs/unknown', { lang }), context.translate('/commands/langs/availables', { availables }))
        }
    }

}
