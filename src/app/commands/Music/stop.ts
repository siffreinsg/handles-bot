import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Stop extends Command {
    static activated: boolean = true
    command: string = 'stop'
    desc: string = 'Stop music player.'
    permissions: Permission[] = [
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'MANAGE_MESSAGES',
        'MANAGE_GUILD',
        'MANAGE_CHANNELS',
        'KICK_MEMBERS',
        'BAN_MEMBERS'
    ]
    args: Argument[] = []
    allowDM: boolean = false
    aliases: String[] = ['leave']

    execute(context: Context, args: Arguments) {
        if (app.music.isPlaying(context.server.id)) {
            app.music.servers[context.server.id].dispatcher.end()
            context.reply('Music stopped')
        } else {
            context.replyError('custom', context.translate('/music/errors/musicPlayerOff'), context.translate('/music/errors/noMusic'))
        }
    }

}
