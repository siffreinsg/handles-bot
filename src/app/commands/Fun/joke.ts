import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as request from 'request'
import * as deepl from 'node-deepl'
import { RichEmbed } from 'discord.js'

export default class Ping extends Command {
    command: string = 'joke'
    desc: string = 'You\'re so funny'
    permissions: Permission[] = []
    args: Argument[] = []


    execute(context: Context, args: Arguments) {
        let options = {
            url: 'https://icanhazdadjoke.com/',
            headers: {
                'Accept': 'application/json'
            }
        }

        request(options, function (err, res, body) {
            if (!err && res.statusCode === 200) {
                let data = JSON.parse(body)

                if (app.config.translate) {
                    deepl(data.joke, 'EN', app.config.lang.split('_')[1], (err, res) => {
                        if (err) {
                            console.log(err)
                            context.reply(app.translate('/errors/basicError', context.server.id))
                            return
                        } else {
                            let embed = new RichEmbed()
                                .setColor('#042d48')
                                .setTitle(app.translate('/translations/autoTranslation', context.server.id))
                                .setDescription('\n```\n' + res + '\n```')
                                .setFooter(app.translate('/translations/translationsWarn', context.server.id))
                            context.reply(data.joke, embed)
                        }
                    })
                } else {
                    context.reply(data.joke)
                }
            } else {
                console.log(err)
                context.reply(app.translate('/errors/basicError', context.server.id))
            }
        })
    }

}
