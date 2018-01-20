import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as request from 'request'
import * as Discord from 'discord.js'
import * as deepl from 'node-deepl'

export default class Advice extends Command {
    command: string = 'advice'
    desc: string = 'Improve your life !'
    args: Argument[] = []

    execute(context: Context, args: Arguments) {
        request('http://api.adviceslip.com/advice', function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let advice = JSON.parse(body)
                if (app.config.translate) {
                    deepl(advice.slip.advice, 'EN', app.config.lang.split('_')[1], (err, res) => {
                        if (err) {
                            console.log(err)
                            context.reply(app.translate('/errors/basicError'))
                            return
                        } else {
                            let embed = new Discord.RichEmbed()
                                .setColor('#042d48')
                                .setTitle(app.translate('/translations/autoTranslation', context.server.id))
                                .setDescription('\n```\n' + res + '\n```')
                                .setFooter(app.translate('/translations/translationsWarn', context.server.id))
                            context.reply(advice.slip.advice, embed)
                        }
                    })
                } else {
                    context.reply(advice.slip.advice)
                }
            } else {
                console.log(error)
                context.reply(app.translate('/errors/basicError'))
            }
        })

    }

}
