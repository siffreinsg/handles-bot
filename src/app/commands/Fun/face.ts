import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as cool from 'cool-ascii-faces'

export default class Face extends Command
{
    command: string = 'face'
    desc: string = '¯\\_(ツ)\_/¯'
    args : Argument[] = []
    
    execute(context : Context, args: Arguments){
        context.message.delete().then(m => context.reply(cool()))
    }
}