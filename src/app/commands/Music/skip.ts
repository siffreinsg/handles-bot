import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class Skip extends Command {
    static activated: boolean = true
    command: string = 'skip'
    desc: string = 'Skip the current music.'
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
    props: {} = {}
    allowDM: boolean = false
    aliases: string[] = ['change']
    usage: string = 'skip'

    execute(context: Context, args: Arguments) {
        if (app.music.isPlaying(context.server.id)) {
            context.reply(context.translate('/music/resp/skippingMusic'))
            app.music.servers[context.server.id].dispatcher.end('skip')
        } else {
            context.replyError('custom', context.translate('/music/errors/musicPlayerOff'), context.translate('/music/errors/noMusic'))
        }
    }

}
