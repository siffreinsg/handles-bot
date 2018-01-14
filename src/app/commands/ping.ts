import Command from 'Gus/Command/CommandHandler'
import Context from 'Gus/Command/CommandContext'
import Arguments from 'Gus/Utils/Arguments'
import Argument = Gus.CommandArgument
import Permission = Gus.CommandPermission
import * as Discord from 'discord.js'

export default class Ping extends Command
{
    command: string = 'ping'
    desc: string = 'What time is it ?'
    args : Argument[] = []
    
    
    async execute(context : Context, args: Arguments){
        let m : any = await context.message.channel.send('Pong!')
        m.edit(`Pong! \`${m.createdTimestamp - context.message.createdTimestamp}ms\` :watch:`)
    }
    
}

