import { RichEmbed } from 'discord.js'

export function StreamHandler() {
    let servers = app.db.getServers().value(),
        today = new Date()

    for (var key in servers) {
        let config = servers[key].config
        let announceChan = getAnnounceChannel(servers[key].id)
        if (!app.tmp['livenotif']) app.tmp['livenotif'] = {}

        if (config.livenotif && announceChan) {
            if (!app.tmp['livenotif'][servers[key].id]) app.tmp['livenotif'][servers[key].id] = { announced: {} }
            let announced = app.tmp['livenotif'][servers[key].id].announced

            config.livenotif.forEach(channel => {
                if (channel.plateform === 'youtube') {
                    app.streamchecker.YouTube.isStreaming(channel.channel, ['snippet'])
                        .then(stream => {
                            if (stream && !announced[channel.channel]) {
                                announced[channel.channel] = true
                                announce(stream, channel, announceChan)
                            } else {
                                if (announced[channel.channel]) announced[channel.channel] === false
                            }
                        }).catch(404)
                }
                if (channel.plateform === 'twitch') {
                    app.streamchecker.Twitch.isStreaming(channel.channel)
                        .then(stream => {
                            if (stream && !announced[channel.channel]) {
                                announced[channel.channel] = true
                                announce(stream.stream, channel, announceChan)
                            } else {
                                if (announced[channel.channel]) announced[channel.channel] === false
                            }
                        }).catch(505)
                }
            })
        }
    }
}

function announce(stream, channelData, announceChan) {
    let p = channelData.plateform,
        name = p === 'youtube' ? channelData.name : stream.channel.display_name,
        title = p === 'youtube' ? stream.items[0].snippet.title : stream.game,
        url = p === 'youtube' ? 'https://youtu.be/' + stream.items[0].id.videoId : 'https://twitch.tv/' + channelData.channel,
        lang = app.translator.getServerLang(announceChan.guild.id)

    announceChan.send(app.translator.translate('/events/livenotif', lang, { name, title, url }))
}

function getAnnounceChannel(serverid) {
    let chanid = app.db.getConfig(serverid).get('livenotifChan').value()
    if (chanid && app.client.channels.has(chanid)) {
        return app.client.channels.get(chanid)
    } else return undefined
}
