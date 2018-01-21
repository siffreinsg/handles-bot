import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as Discord from 'discord.js'

export default class Avatar extends Command {
    command: string = 'avatar'
    desc: string = 'Get avatars from anyone'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'user', type: 'text', required: false, usage: '@user' }
    ]
    allowDM: boolean = true

    execute(context: Context, args: Arguments) {
        let mention = context.message.mentions.users.first(),
            user = mention ? mention : context.executor,
            message = 'Avatar de ' + user.username

        if (!user.avatarURL) return context.replyError('custom', '/commands/avatar/error', '/commands/avatar/noAvatar')

        let embed = new Discord.RichEmbed()
            .setAuthor(user.username, user.displayAvatarURL)
            .setImage(user.displayAvatarURL)
        context.reply(message, embed)
    }

}
