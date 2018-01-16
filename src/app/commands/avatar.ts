import Command from 'Gus/Command/CommandHandler'
import Context from 'Gus/Command/CommandContext'
import Arguments from 'Gus/Utils/Arguments'
import Argument = Gus.CommandArgument
import Permission = Gus.CommandPermission
import * as Discord from 'discord.js'

export default class Avatar extends Command
{
    command: string = 'avatar'
    desc: string = 'Get avatars from anyone'
    args : Argument[] = [
        {name: 'user', type: 'text', required: false, usage: '@user'}
    ]
    
    execute(context : Context, args: Arguments){
        let mention = context.message.mentions.users.first(),
            user = mention ? mention : context.executor.user,
            message = 'Avatar de ' + user.username

        if (!user.avatarURL) return context.replyError(app.translate('/commands/avatar/noAvatar'), {})

        let embed = new Discord.RichEmbed()
            .setAuthor(user.username, user.avatarURL)
            .setImage(user.avatarURL)
        context.replyEmbed(message, embed)
    }
    
}
