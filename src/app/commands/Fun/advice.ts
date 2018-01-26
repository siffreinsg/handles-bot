import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as got from 'got'
import * as Discord from 'discord.js'
import * as deepl from 'node-deepl'

export default class Advice extends Command {
    command: string = 'advice'
    desc: string = 'Improve your life !'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = true

    execute(context: Context, args: Arguments) {
        context.processing().then((msg: any) => {
            got('http://api.adviceslip.com/advice').then(res => {
                if (res.statusCode === 200) {
                    let advice = JSON.parse(res.body),
                        lang = app.translator.defaultLang
                    if (context.server && context.server.id) lang = app.translator.getServerLang(context.server.id)

                    if (app.config.translate) {
                        deepl(advice.slip.advice, 'EN', lang.split('_')[0].toUpperCase(), (err, res) => {
                            if (err) { if (msg.deletable) { msg.delete() } context.replyError() }
                            else {
                                let embed = new Discord.RichEmbed()
                                    .setColor('#042d48')
                                    .setTitle(context.translate('/translations/autoTranslation'))
                                    .setDescription('\n```\n' + res + '\n```')
                                    .setFooter(context.translate('/translations/translationsWarn'))
                                msg.edit(advice.slip.advice, embed)
                            }
                        })
                    } else msg.edit(advice.slip.advice)
                } else { if (msg.deletable) { msg.delete() } context.replyError() }
            })
        })
    }

}
