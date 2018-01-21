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

    execute(context: Context, args: Arguments) {
        got('http://api.adviceslip.com/advice').then(res => {
            if (res.statusCode === 200) {
                let advice = JSON.parse(res.body)

                if (app.config.translate) {
                    deepl(advice.slip.advice, 'EN', app.config.lang.split('_')[1], (err, res) => {
                        if (err) { context.replyError() }
                        else {
                            let embed = new Discord.RichEmbed()
                                .setColor('#042d48')
                                .setTitle(app.translate('/translations/autoTranslation', context.server.id))
                                .setDescription('\n```\n' + res + '\n```')
                                .setFooter(app.translate('/translations/translationsWarn', context.server.id))
                            context.reply(advice.slip.advice, embed)
                        }
                    })
                } else context.reply(advice.slip.advice)
            } else context.replyError()
        })

    }

}
