import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed, TextChannel } from 'discord.js'

export default class Play extends Command {
    static activated: boolean = true
    command: string = 'play'
    desc: string = 'Play command.'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'url', type: 'text', required: true, usage: 'url yt' }
    ]
    allowDM: boolean = false

    execute(context: Context, args: Arguments) {
        context.delete()
        context.processing().then((msg: any) => {

            let voiceChannel = context.server.member(context.executor.id).voiceChannel

            if (!voiceChannel) {
                msg.delete()
                return context.replyError('custom', context.translate('/music/errors/noVoiceChan'), context.translate('/music/errors/joinVoiceChan'))
            }

            voiceChannel.join()
                .then(connection => {
                    msg.delete()
                    args.getAll().forEach((url: any) => {
                        app.music.addToQueue(url, context.server.id, err => {
                            if (err) {
                                voiceChannel.leave()
                                return context.replyError()
                            }
                            if (!app.music.isPlaying(context.server.id)) app.music.playMusic(url, connection, context)
                            else app.music.announceMusic(url, context, context.translate('/music/resp/addedQueue'))
                        })
                    })
                }).catch(console.error)
        })
    }
}