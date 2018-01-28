import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed, TextChannel } from 'discord.js'
import * as youtubeSearch from 'youtube-search'
import { isUri } from 'valid-url'

export default class Play extends Command {
    static activated: boolean = true
    command: string = 'play'
    desc: string = 'Play command.'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'url', type: 'text', required: false, usage: 'url yt' }
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

            let urls: Array<any> = []
            if (!args.get(0)) urls = ['https://www.youtube.com/watch?v=Zr1hxCxtfdM']
            else if (!isUri(args.get(0))) {
                let search = args.getAll().join(' ')

                youtubeSearch(search, { maxResults: 1, key: app.config.ytAPIkey }, (err, results) => {
                    if (err) return context.replyError()
                    if (results && results[0]) urls.push(results[0].link)
                    else return context.replyError('custom', context.translate('/music/notFound'), context.translate('/music/cannotFindSearch'))
                })
            } else urls = args.getAll()
            urls.forEach(url => { if (!isUri(url)) return context.replyError('badArgs') })

            voiceChannel.join()
                .then(connection => {
                    msg.delete()
                    urls.forEach((url: any) => {
                        app.music.addToQueue(url, context.server.id, err => {
                            if (err) {
                                if (!app.music.isPlaying(context.server.id)) voiceChannel.leave()
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
