import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as got from 'got'
import { RichEmbed } from 'discord.js'
import * as validUrl from 'valid-url'

export default class Shorturl extends Command {
    command: string = 'shorturl'
    desc: string = 'URL Shortener'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'url', type: 'text', required: true, usage: 'url' }
    ]
    allowDM: boolean = false

    async execute(context: Context, args: Arguments) {
        let url = '' + args.get(0)

        if (validUrl.isUri(url)) {
            let response = await got('http://tinyurl.com/api-create.php?url=' + encodeURIComponent(url)),
                embed = new RichEmbed()
                    .setColor(context.getUserColor())
                    .setFooter(context.translate('/misc/requestedBy', { user: context.executor.tag }), context.executor.displayAvatarURL)
                    .addField(context.translate('/commands/shorturl/original'), url)
                    .addField(context.translate('/commands/shorturl/shortened'), response.body)
            context.reply('', embed)
        } else context.replyError('badArgs')
    }

}
