import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'

export default class Queue extends Command {
    command: string = 'queue'
    desc: string = 'Get musics listed in server\'s queue.'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = false

    execute(context: Context, args: Arguments) {
        if (app.music.isPlaying(context.server.id)) {
            let embed = new RichEmbed()
                .setColor(context.getUserColor())
                .setAuthor('Queue for ' + context.server.name)
            let serverMusic = app.music.servers[context.server.id]
            let desc = context.translate('/music/resp/musics')
            serverMusic.queue.forEach(music => {
                let { title, duration } = serverMusic.infos[music]
                desc += context.translate('/music/resp/queueFormat', { title, music, duration })
            })
            context.reply('', embed.setDescription(desc))
        } else {
            context.replyError('custom', context.translate('/music/errors/musicPlayerOff'), context.translate('/music/errors/noMusic'))
        }
    }

}
