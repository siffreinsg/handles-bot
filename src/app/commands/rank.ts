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

        let users = app.db.getUsers(askedUser.guild.id).value()

        users.sort(function(a, b){
            let LevelA = Math.floor(Math.floor(25 + Math.sqrt(625 + 100 * a.xp)) / 50),
                LevelB = Math.floor(Math.floor(25 + Math.sqrt(625 + 100 * b.xp)) / 50)
            return a.level - b.level
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

