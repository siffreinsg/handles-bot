import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { MessageReaction, User, Message, RichEmbed } from 'discord.js'

export default class Poll extends Command {
    static activated: boolean = true
    command: string = 'poll'
    desc: string = 'Create a poll'
    permissions: Permission[] = []
    args: Argument[] = [
        { type: 'text', required: true }
    ]
    props: {} = {
        '--alow-multiple': Boolean,
        '--allow-custom': Boolean,
        '--timeout': Number,
        '-m': '--allow-multiple',
        '-c': '--allow-custom',
        '-t': '--timeout',
        '--multiple': '-m',
        '--custom': '-c',
    }
    allowDM: boolean = false
    aliases: string[] = []
    usage: string = 'poll question/answer 1/answer 2/etc [--allow-custom OR -c] [--allow-multiple OR -m] [--timeout=NUMBER OR -t=NUMBER]'

    async execute(context, args) {
        const reactions = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟']
        let toSend = '',
            answers: Array<string> = args.getAll().join(' ').split('/'),
            allow_multiple = args.getProp('--allow-multiple') || undefined,
            allow_custom = args.getProp('--allow-custom') || undefined,
            timeout = parseInt(args.getProp('--timeout') || false),
            finished = false,
            results: number[]

        context.delete()
        context.reply(context.translate('/commands/poll/generating')).then(async (msg: Message) => {
            if (answers.length < 3 || answers.length > 12) {
                msg.delete()
                return context.replyError('badArgs')
            }
            let question = answers.splice(0, 1)

            for (let i = 0; i < answers.length; i++) {
                await msg.react(reactions[i])
                toSend += reactions[i] + ' *' + answers[i].replace(/^\s+|\s+$|\s+(?=\s)/g, '') + '*\n'
            }

            msg.react('🔓')
            let pollEmbed = await new RichEmbed()
                .setColor(context.getUserColor(context.executor.id))
                .setAuthor(context.translate('/commands/poll/newPoll', { user: context.server.member(context.executor.id).displayName }))
                .setDescription(context.translate('/commands/poll/question', { question: question[0].replace(/^\s+|\s+$|\s+(?=\s)/g, '') }))
                .addField(context.translate('/commands/poll/voteByClick'), toSend, true)
                .addField(context.translate('/commands/poll/params'), context.translate('/commands/poll/paramsField', { status1: (allow_multiple ? '✅' : '❎'), status2: (allow_custom ? '✅' : '❎') }))

            if (timeout) pollEmbed.setFooter(context.translate('/commands/poll/finalResults', { timeout }))
            msg.edit(context.translate('/commands/poll/pleaseIgnore'), { embed: pollEmbed })

            if (timeout) {
                setTimeout(() => {
                    finished = true
                    results = this.finishPoll(msg)
                    let toSend = ''

                    for (let i = 0; i < answers.length; i++) { if (answers[i]) toSend += reactions[i] + ' *' + answers[i] + '* => **' + results[i] + '** votes\n' }

                    let embed = new RichEmbed()
                        .setColor(context.getUserColor(context.executor.id))
                        .setAuthor(context.translate('/commands/poll/pollBy', { user: context.server.member(context.executor.id).displayName }))
                        .setDescription(context.translate('/commands/poll/question', { question: question[0].replace(/^\s+|\s+$|\s+(?=\s)/g, '') }))
                        .addField(context.translate('/commands/poll/results'), toSend, true)
                        .addField(context.translate('/commands/poll/params'), context.translate('/commands/poll/paramsField', { status1: (allow_multiple ? '✅' : '❎'), status2: (allow_custom ? '✅' : '❎') }))
                    msg.edit(context.translate('/commands/poll/finished'), { embed })
                }, timeout * 60 * 1000, this)
            }

            app.client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
                if (reaction.message.id === msg.id && user.id !== app.client.user.id) {
                    if (reaction.emoji.name === '🔓' || reaction.emoji.name === '🔐') {
                        if (user.id !== context.executor.id) return reaction.remove(user)

                        finished = finished ? false : true
                        await reaction.users.array().forEach((user) => reaction.remove(user))
                        return msg.react(finished ? '🔐' : '🔓')
                    }

                    if (finished) return reaction.remove(user)
                    if (!allow_custom && reaction.count === 1) return reaction.remove(user)

                    msg.reactions.forEach((value, key) => {
                        if (!allow_multiple && value.emoji.identifier !== reaction.emoji.identifier && value.users.has(user.id)) {
                            value.remove(user)
                        }
                    })
                }
            })
        })
    }

    finishPoll(message: Message): number[] {
        let reactions = message.reactions.array(), results: number[] = []
        reactions.forEach(async (reaction, index) => {
            if (['🔓', '🔐'].indexOf(reaction.emoji.name) === -1)
                results[index] = reaction.count - 1
            else {
                reaction.users.array().forEach(async (user) => reaction.remove(user))
                message.react('🔐')
            }
        })
        return results
    }

}
