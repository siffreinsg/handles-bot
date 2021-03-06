import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as Discord from 'discord.js'

export default class Avatar extends Command {
    static activated: boolean = true
    command: string = 'avatar'
    desc: string = 'Get avatars from anyone'
    permissions: Permission[] = []
    args: Argument[] = [
        { type: 'text', required: false }
    ]
    props: {} = {}
    allowDM: boolean = true
    aliases: string[] = []
    usage: string = 'avatar [@user]'

    execute(context: Context, args: Arguments) {
        let mention = context.message.mentions.users.first(),
            user = mention ? mention : context.executor,
            message = context.translate('/commands/avatar/userAvatar', { user: user.username })

        if (!user.avatarURL) return context.replyError('custom', '/commands/avatar/error', '/commands/avatar/noAvatar')

        let embed = new Discord.RichEmbed()
            .setColor(context.getUserColor(user.id))
            .setAuthor(user.username, user.displayAvatarURL)
            .setImage(user.avatarURL)
        context.reply(message, embed)
    }

}
