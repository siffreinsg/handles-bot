import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
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

