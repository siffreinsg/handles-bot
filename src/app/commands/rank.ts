import Command from 'Gus/Command/CommandHandler'
import Context from 'Gus/Command/CommandContext'
import Arguments from 'Gus/Utils/Arguments'
import Argument = Gus.CommandArgument
import Permission = Gus.CommandPermission
import User from 'Gus/DB/User'
import { RichEmbed } from 'discord.js'

export default class Rank extends Command
{
    command: string = 'rank'
    desc: string = 'Check a user\'s level in the server.'
    args : Argument[] = [
        {name: 'user', type: 'text', required: false, usage: '@user'}
    ]
    
    
    execute(context : Context, args: Arguments){
        let firstMention = context.message.mentions.members.first(),
            askedUser = firstMention ? firstMention : context.executor,
            user = new User(askedUser)
        
        let embed = new RichEmbed()
            .setColor(askedUser.displayHexColor)
            .setAuthor(askedUser.displayName, askedUser.user.avatarURL)
            .addField('Level', user.getLevel(), true)
            .addField('XP', user.getXP(), true)
            .addField('Total XP', user.xp, true)

        context.replyEmbed('', embed)
    }
    
}

