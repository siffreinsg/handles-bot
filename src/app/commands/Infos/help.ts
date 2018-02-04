import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { MessageReaction, User, Message, RichEmbed } from 'discord.js'

export default class Help extends Command {
    static activated: boolean = true
    command: string = 'help'
    desc: string = ''
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'command', type: 'text', required: false, usage: 'command name' }
    ]
    allowDM: boolean = true
    aliases: string[] = []
    usage: string = ''

    execute(context, args) {
        context.delete()
        let tmp = app.tmp,
            interactive = 'commands.interactivehelp',
            userid = context.executor.id

        if (!tmp[interactive]) app.tmp['commands.interactivehelp'] = {}
        else if (tmp[interactive][userid]) tmp[interactive][userid].delete().catch(err => { return 666 })

        var appthis = this, page = 0, cmdlength = app.commands.list.length - 3, maxCmdsPerPage = 6, maxPagesForCmds = page + Math.floor(cmdlength / maxCmdsPerPage) + 1
        var help = new RichEmbed()
            .setColor(context.getUserColor(app.client.user.id))
            .setAuthor(context.translate('/help/interactiveHelp'))
            .setDescription(context.translate('/help/website'))
            .addField(context.translate('/help/howTo'), context.translate('/help/howToText'), true)
            .addField(context.translate('/help/navigation'), this.getNavigation(page, maxPagesForCmds, context), true)
            .setFooter(context.translate('/misc/requestedBy', { user: context.executor.tag }), context.executor.displayAvatarURL)

        context.executor.send(context.translate('/commands/about/message'), help).then((msg: Message) => {
            if (context.channel.type === 'text') context.reply(context.translate('/help/checkDM')).then(msg => msg.delete(5000))
            reactHandler(msg)
        }).catch(err => {
            context.reply(context.translate('/commands/about/message'), help).then((msg: Message) => {
                reactHandler(msg)
            })
        })

        async function reactHandler(msg: Message) {
            tmp[interactive][userid] = msg

            await msg.react('◀')
            await msg.react('ℹ')
            await msg.react('▶')
            await msg.react('🛑')

            app.client.on('messageReactionAdd', (reaction: MessageReaction, user: User) => {
                if (reaction.message.id === msg.id && user.id !== app.client.user.id) {
                    if (user.id === context.executor.id) {
                        switch (reaction.emoji.name) {
                            case '◀':
                                if (page === 1) {
                                    page--
                                    msg.edit(context.translate('/misc/requestOfInfo'), help)
                                } else if (page > 0) {
                                    page--
                                    let embed = appthis.genCommandEmbed(context, (page - 1) * maxCmdsPerPage, maxCmdsPerPage)
                                        .addBlankField()
                                        .addField(context.translate('/help/navigation'), appthis.getNavigation(page, maxPagesForCmds, context))
                                    msg.edit('Page n°' + page, { embed: embed })
                                }
                                break
                            case 'ℹ':
                                if (page !== 0) {
                                    page = 0
                                    msg.edit(context.translate('/commands/about/message'), help)
                                }
                                break
                            case '▶':
                                if (page < maxPagesForCmds) {
                                    page++
                                    let embed = appthis.genCommandEmbed(context, (page - 1) * maxCmdsPerPage, maxCmdsPerPage)
                                        .addBlankField()
                                        .addField(context.translate('/help/navigation'), appthis.getNavigation(page, maxPagesForCmds, context))
                                    msg.edit(context.translate('/help/page index', { page }), { embed: embed })
                                }
                                break
                            case '🛑':
                                if (msg.deletable) msg.delete()
                                break
                        }
                    }
                    if (msg.channel.type === 'text') reaction.remove(user)
                }
            })
        }
    }

    genCommandEmbed(context: Context, start: number = 0, maxCmd: number = 24) {
        let ignore = ['help', 'error', 'halt', 'hello'],
            cmds = app.commands.list,
            embed = new RichEmbed()
                .setColor(context.getUserColor(app.client.user.id))
                .setAuthor(context.translate('/help/commands'))
                .setDescription(context.translate('/help/returnToMain'))
                .setFooter(context.translate('/misc/requestedBy', { user: context.executor.tag }), context.executor.displayAvatarURL)

        for (let i = start; (i < start + maxCmd) && (i < cmds.length); i++) {
            let { command, desc, allowDM, activated, usage } = app.commands.cmds[cmds[i]]
            if (ignore.indexOf(command) === -1) embed.addField(command, context.translate('/help/commandsField', { desc, usage, allowDM: (allowDM ? context.translate('/help/yes') : context.translate('/help/no')) }))
        }

        return embed
    }

    getNavigation(page: number, maxPage: number, context: Context): string {
        let availables = [context.translate('/help/help')]
        for (let i = 0; i < maxPage; i++) { availables.push(context.translate('/help/commands')) }

        let previous = availables[page - 1] || context.translate('/help/none'),
            current = availables[page],
            next = availables[page + 1] || context.translate('/help/none')
        return context.translate('/help/navigationField', { previous, current, next })
    }
}
