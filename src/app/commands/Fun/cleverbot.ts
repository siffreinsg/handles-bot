import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as CleverbotAPI from 'cleverbot-api'

export default class Cleverbot extends Command {
    static activated: boolean = true
    command: string = 'cleverbot'
    desc: string = 'Talk with the bot.'
    permissions: Permission[] = []
    args: Argument[] = []
    props: {} = {}
    allowDM: boolean = true
    cleverbot: CleverbotAPI = new CleverbotAPI(app.config.cleverbotAPIkey)
    aliases: string[] = ['talk']
    usage: string = 'cleverbot <message>'

    execute(context: Context, args: Arguments) {
        this.cleverbot.getReply({
            input: args.getAll().join(' ')
        }, (error, response) => {
            if (error) context.replyError()
            context.reply(response.output)
        })
    }

}
