import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as CleverbotAPI from 'cleverbot-api'

export default class Cleverbot extends Command {
    command: string = 'cleverbot'
    desc: string = 'Talk with me.'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = true
    cleverbot: CleverbotAPI = new CleverbotAPI(app.config.cleverbotAPIkey)

    execute(context: Context, args: Arguments) {
        this.cleverbot.getReply({
            input: args.getAll().join(' ')
        }, (error, response) => {
            if (error) context.replyError()
            context.reply(response.output)
        })
    }

}
