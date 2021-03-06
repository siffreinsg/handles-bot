import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as got from 'got'
import * as deepl from 'node-deepl'
import { RichEmbed } from 'discord.js'

export default class Joke extends Command {
    static activated: boolean = true
    command: string = 'joke'
    desc: string = 'Some funny jokes'
    permissions: Permission[] = []
    args: Argument[] = []
    props: {} = {}
    allowDM: boolean = true
    aliases: string[] = []
    usage: string = 'joke'

    execute(context: Context, args: Arguments) {
        context.processing().then((msg: any) => {

            let options = {
                headers: {
                    'Accept': 'application/json'
                }
            }

            got('https://icanhazdadjoke.com/', options).then(res => {
                if (res.statusCode === 200) {
                    let data = JSON.parse(res.body),
                        lang = app.translator.defaultLang
                    if (context.server && context.server.id) lang = app.translator.getServerLang(context.server.id)

                    if (app.config.translate) {
                        deepl(data.joke, 'EN', lang.split('_')[0].toUpperCase(), (err, res) => {
                            if (err) { if (msg.deletable) { msg.delete() } context.replyError() }
                            else {
                                let embed = new RichEmbed()
                                    .setColor('#042d48')
                                    .setTitle(context.translate('/translations/autoTranslation'))
                                    .setDescription('\n```\n' + res + '\n```')
                                    .setFooter(context.translate('/translations/translationsWarn'))
                                msg.edit(data.joke, embed)
                            }
                        })
                    } else msg.edit(data.joke)
                } else { if (msg.deletable) { msg.delete() } context.replyError() }
            })
        })
    }

}
