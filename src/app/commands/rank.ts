import Command from 'Gus/Command/CommandHandler'
import Context from 'Gus/Command/CommandContext'
import Arguments from 'Gus/Utils/Arguments'
import Argument = Gus.CommandArgument
import Permission = Gus.CommandPermission
import User from 'Gus/DB/User'

export default class Rank extends Command
{
    command: string = 'rank'
    desc: string = 'Check a user\'s level in the server.'
    args : Argument[] = [
        {name: 'user', type: 'text', required: false, usage: '@user'}
    ]
    
    
    execute(context : Context, args: Arguments){
        let firstMention = context.message.mentions.users.first(),
            askUser = firstMention ? firstMention : context.executor.user,
            user = new User(context.executor)
            
        context.reply('XP: ' + user.xp + '\nLevel: ' + user.level)
    }
    
}

