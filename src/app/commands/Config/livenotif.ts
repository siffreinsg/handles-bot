import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { randomHexColor } from 'Handles/Utils/Misc'
import { RichEmbed } from 'discord.js'

export default class LiveNotif extends Command {
    static activated: boolean = true
    command: string = 'livenotif'
    desc: string = 'Get notified when a channel is streaming (YouTube and Twitch).'
    permissions: Permission[] = []
    args: Argument[] = [
        { type: 'text', required: true }
    ]
    props: {} = {}
    allowDM: boolean = false
    aliases: string[] = ['live', 'streaming', 'livehandler', 'stream', 'streamnotif']
    usage: string = 'livenotif help'

    execute(context: Context, args: Arguments) {
        let action = args.get(0)

        switch (action) {
            case 'list':
                (async function () {
                    let livenotifs = app.db.createIfNotExists(app.db.getConfig(context.server.id), 'livenotif', []).value(),
                        toSend = context.translate('/commands/livenotif/configured')

                    if (livenotifs.length === 0) return context.reply(context.translate('/commands/livenotif/empty'))

                    livenotifs.forEach(data => {
                        let { name, channel, plateform } = data,
                            url = plateform === 'twitch' ? 'https://twitch.tv' + channel : 'https://youtube.com/channel/' + channel

                        toSend += context.translate('/commands/livenotif/listFormat', { name, url })
                    })

                    context.reply(toSend, { split: true })
                }())
                break
            case 'add':
                (function () {
                    if (!context.isAdmin()) return context.replyError('notAdmin')
                    if (!args.get(1) || !args.get(2)) return context.replyError('badArgs')

                    let plateform = args.get(1) + '',
                        channel = args.get(2) + ''

                    if (['twitch', 'tw'].indexOf(plateform) !== -1) plateform = 'twitch'
                    else if (['youtube', 'yt', 'ytb'].indexOf(plateform) !== -1) plateform = 'youtube'
                    else return context.replyError('badArgs')

                    if (plateform === 'youtube') {
                        app.streamchecker.YouTube.getChannel(channel, ['snippet'])
                            .then(channel => {
                                if (channel) next(channel.items[0].snippet.title)
                                else context.replyError('custom', context.translate('/commands/livenotif/cantAdd'), context.translate('/commands/livenotif/doesntExist'))
                            }).catch(err => context.replyError())
                    }
                    if (plateform === 'twitch') {
                        app.streamchecker.Twitch.getUser(channel)
                            .then(user => {
                                if (user) next(user.display_name)
                                else context.replyError('custom', context.translate('/commands/livenotif/cantAdd'), context.translate('/commands/livenotif/doesntExist'))
                            }).catch(err => context.replyError())
                    }
                    function next(name = channel) {
                        let current = app.db.createIfNotExists(app.db.getConfig(context.server.id), 'livenotif', [])

                        if (current.find({ channel }).value()) return context.replyError('custom', context.translate('/commands/livenotif/cantAdd'), context.translate('/commands/livenotif/alreadyExists', { channel }))

                        current.push({ channel, plateform, name }).write()
                        context.reply(context.translate('/commands/livenotif/added'))
                    }
                })()
                break
            case 'delete':
                (async function () {
                    if (!context.isAdmin()) return context.replyError('notAdmin')
                    if (!args.get(1)) return context.replyError('badArgs')

                    let channel = args.get(1) + '',
                        current = app.db.createIfNotExists(app.db.getConfig(context.server.id), 'livenotif', [])

                    if (!current.find({ channel }).value()) return context.replyError('custom', context.translate('/commands/livenotif/cantDel'), context.translate('/commands/livenotif/doesntExist'))
                    current.remove({ channel }).write()
                    context.reply(context.translate('/commands/livenotif/deleted'))
                })()
                break
            case 'channel':
                (function () {
                    if (!context.isAdmin()) return context.replyError('notAdmin')

                    let channel = context.message.mentions.channels.first()
                    if (!channel || !channel.id) {
                        app.db.getConfig(context.server.id).unset('livenotifChan').write()
                        return context.reply(context.translate('/commands/livenotif/noChan'))
                    } else {
                        app.db.getConfig(context.server.id).set('livenotifChan', channel.id).write()
                        return context.reply(context.translate('/commands/livenotif/chanSet', { channel: channel.toString() }))
                    }
                })()
                break
            case 'help':
                // TODO    
                break
            default:
                context.replyError('badArgs')
                break
        }

    }

}
