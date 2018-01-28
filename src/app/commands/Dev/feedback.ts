import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'

export default class Feedback extends Command {
    static activated: boolean = true
    command: string = 'feedback'
    desc: string = 'Give us feedback using this command.'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'message', type: 'text', required: true, usage: 'feedback' }
    ]
    allowDM: boolean = true

    execute(context: Context, args: Arguments) {
        let message = args.getAll().join(' '),
            chan: any = app.client.channels.find('id', app.config.feedbackChanID)

        if (chan.type && ['text', 'dm', 'group'].indexOf(chan.type) !== -1) {
            let embed = new RichEmbed()
                .setColor(context.getUserColor(context.executor.id))
                .setAuthor('New feedback !', context.executor.displayAvatarURL)
                .setDescription(message)
                .setFooter('Sent by: ' + context.executor.tag)
            chan.send('', embed)
            context.reply(context.translate('/commands/feedback/thanksForFeedback'))
        } else {
            context.replyError('custom', context.translate('/commands/feedback/noChan'), context.translate('/commands/feedback/cantFindChan'))
        }
    }

}
