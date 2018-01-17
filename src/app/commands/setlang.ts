import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class SetLang extends Command
{
    command: string = 'setlang'
    desc: string = 'Change server lang'
    args : Argument[] = [
        {name: 'lang', type: 'text', required: true, usage: 'lang'}
    ]
    
    execute(context : Context, args: Arguments){
        let lang = '' + args.get(0)
        if (lang === 'default') lang = 'en_US'
        let langs = Object.keys(app.translator.langs)

        if (langs.indexOf(lang) !== -1) {
            app.db.getConfig(context.server.id).set('lang', lang).write()
            context.reply(app.translate('/commands/langs/langSet', context.server.id, {lang}))
        } else {
            let availables = ''
            langs.forEach(lang => {availables += lang + ', '})
            availables += 'default (en_US)'
            context.reply(app.translate('/commands/langs/unknown', context.server.id, {lang, availables}))
        }
    }
    
}

