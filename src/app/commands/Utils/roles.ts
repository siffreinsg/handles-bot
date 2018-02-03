/*
====================
= WORK IN PROGRESS =
====================
*/

import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as Discord from 'discord.js'

export default class Roles extends Command {
    static activated: boolean = false
    command: string = 'roles'
    desc: string = 'Get access to super secrets channels.'
    permissions: Permission[] = []
    args: Argument[] = [
        { name: 'action', type: 'text', required: true, usage: 'join|list|add|del' }
    ]
    allowDM: boolean = false
    aliases: string[] = ['role', 'channels']
    usage: string = 'roles help'

    execute(context: Context, args: Arguments) {
        let action = args.get(0),
            roles = app.db.getConfig(context.server.id).get('roles', [])

        switch (action) {
            case 'list':
                (function () {
                    let toSend = ''
                    roles.value().forEach(role => {
                        if (role.accessible) toSend += '    > `' + role.name + '` for channel <#' + role.channel + '>: ' + role.desc + '\n'
                    })
                    context.reply('Available roles:\n' + toSend, { split: true })
                }())
                break
            case 'add':
                (function () {
                    let name: any = args.get(1),
                        desc: any = args.getAll().join(' '),
                        channel = context.message.mentions.channels.first(),
                        role = context.server.roles.find('name', name),
                        accessible: boolean = true
                    desc.slice(0, 2)
                    if (channel) desc.slice(0, -1)

                    if (!name) return context.replyError('badArgs')
                    if (roles.find({ name: name }).value()) return context.replyError('custom', 'CA EXISTE DEJA CONNARD', 'EHHHH OUE FAUT PAS FAIRE PLUSIEURS FOIS LA MEME COMMANDE CONNARD')

                    if (!desc) desc = ''
                    if (args.getProp('b')) accessible = false
                    if (!role) context.server.createRole({ name: name, color: 'RANDOM', mentionable: false }).then((rol: any) => {
                        if (!channel || channel.type !== 'text') context.server.createChannel(name + '', 'text').then((chan: any) => {
                            next(rol, chan)
                        })
                        else next(rol, channel)
                    })
                    else next(role, channel)

                    function next(rol, chan) {
                        chan.overwritePermissions(rol, { 'READ_MESSAGES': true })
                        chan.overwritePermissions(context.server.defaultRole, { 'READ_MESSAGES': false })
                        roles.push({ roleid: rol.id, name: name, channel: chan.id, desc: desc, accessible: accessible }).write()
                        context.reply('Created. Roleid: ' + rol.id + ' ; Name: ' + name + ' ; Channel:' + chan.id + ' ; desc: ' + desc)
                    }
                }())
                break
            case 'join':
                context.reply('work in progress')
                break
            default:
                context.replyError('badArgs')
                break
        }

    }

}
