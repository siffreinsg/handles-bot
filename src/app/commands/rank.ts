import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import User from 'Handles/DB/User'
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

        let users = app.db.getUsers(askedUser.guild.id).value()

        users.sort(function(a, b){
            return a.xp - b.xp
        })
        users.reverse()

        let position = users.findIndex(x => x.id === askedUser.id)

        let embed = new RichEmbed()
            .setColor(askedUser.displayHexColor)
            .setAuthor(askedUser.displayName + ' - @' + askedUser.user.tag, askedUser.user.avatarURL)
            .addField('Rank', (position + 1) + '/' + users.length, true)
            .addField('Level', user.getLevel() + ' (Tot. XP: ' + user.xp + ')', true)
            .addField('XP', user.getXP() + '/' + (user.getLevelRequiredXP(user.getLevel() + 1) - user.getLevelRequiredXP()), true)
        context.replyEmbed('', embed)
    }
    
}

