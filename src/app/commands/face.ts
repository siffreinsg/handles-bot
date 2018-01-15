import Command from 'Gus/Command/CommandHandler'
import Context from 'Gus/Command/CommandContext'
import Arguments from 'Gus/Utils/Arguments'
import Argument = Gus.CommandArgument
import Permission = Gus.CommandPermission
import * as cool from 'cool-ascii-faces'

export default class Face extends Command
{
    command: string = 'face'
    desc: string = '¯\_(ツ)_/¯'
    args : Argument[] = []
    
    execute(context : Context, args: Arguments){
        context.message.delete().then(m => context.reply(cool()))
    }
}
