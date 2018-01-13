import Command from 'Gus/Command/CommandHandler'
import Context from 'Gus/Command/CommandContext'
import Arguments from 'Gus/Utils/Arguments'
import Argument = Gus.CommandArgument
import Permission = Gus.CommandPermission

export default class Ping extends Command
{
    command: string = 'ping'
    desc: string = 'What time is it ?'
    args : Argument[] = []
    
    
    async execute(context : Context, args: Arguments){
        let m = await context.message.channel.send('Pong!')
        m.edit(`Pong! \`${m.createdTimestamp - context.message.createdTimestamp}ms\` :watch:`)
    }
    
}
