import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as Discord from 'discord.js'
import { replaceAll, randomHexColor } from 'Handles/Utils/Misc'
import { RichEmbed } from 'discord.js'

export default class Roles extends Command {
    static activated: boolean = true
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
        let action = args.get(0)

        switch (action) {
            case 'list':
                (async function () {
                    let roles = app.db.getConfig(context.server.id).get('roles', []).value(),
                        toSend = ''
                    if (roles.length > 0) {
                        await roles.forEach(role => {
                            if (role.accessible) toSend += context.translate('/commands/roles/roleFormat', { name: role.name, channel: '<#' + role.channel + '>' }) + '\n'
                        })
                        context.reply(context.translate('/commands/roles/availableRoles') + '\n' + toSend, { split: true })
                    } else {
                        context.reply(context.translate('/commands/roles/noRoles'))
                    }
                }())
                break
            case 'add':
                (function () {
                    context.processing().then((msg: any) => {
                        let roles = app.db.getConfig(context.server.id).get('roles', [])
                        let name: any = args.getAll(),
                            channel = context.message.mentions.channels.first(),
                            role = context.server.roles.find('name', name),
                            accessible: boolean = true
                        name.splice(0, 1)
                        name = name.join(' ')
                        if (channel) name.splice(0, -1)

                        if (!name) return context.replyError('badArgs')
                        if (!name.match(/^[a-zA-Z0-9_ ]*$/)) return context.replyError('custom', context.translate('/commands/roles/invalidName'), context.translate('/commands/roles/charsOnly'))
                        if (roles.find({ name: name }).value()) return context.replyError('custom', context.translate('/commands/roles/roleExists'), context.translate('/commands/roles/useOtherName'))

                        if (args.getProp('a') || args.getProp('accessible')) accessible = false
                        if (!role) context.server.createRole({ name: name, color: 'RANDOM', mentionable: false }).then((rol: any) => {
                            if (!channel || channel.type !== 'text') context.server.createChannel(replaceAll(name, ' ', '-'), 'text').then((chan: any) => {
                                next(rol, chan)
                            })
                            else next(rol, channel)
                        })
                        else next(role, channel)

                        async function next(rol, chan) {
                            chan.overwritePermissions(rol, { 'READ_MESSAGES': true })
                            chan.overwritePermissions(context.server.defaultRole, { 'READ_MESSAGES': false })
                            roles.push({ roleid: rol.id, name: name, channel: chan.id, accessible: accessible }).write()
                            msg.edit(context.translate('/commands/roles/created', { name, channel: '<#' + chan.id + '>' }))
                        }
                    })
                }())
                break
            case 'delete':
                (async function () {
                    let roles = app.db.getConfig(context.server.id).get('roles', [])
                    let name: any = args.getAll()
                    name.splice(0, 1)
                    name = name.join(' ')

                    let roledata = await roles.find({ name: name }).value()
                    if (!roledata) return context.replyError('custom', context.translate('/commands/roles/noRole'), context.translate('/commands/roles/doesntExists'))
                    let role = context.server.roles.get(roledata.roleid)
                    let channel = context.server.channels.get(roledata.channel)
                    if (!role && !channel) return context.replyError('custom', context.translate('/commands/roles/noRole'), context.translate('/commands/roles/doesntExists'))

                    let toSend = ''
                    context.processing().then((msg: any) => {
                        if (role && role.editable) {
                            role.delete()
                                .then(role => {
                                    toSend += context.translate('/commands/roles/roleDeleted')
                                    msg.edit(toSend)
                                })
                                .catch(err => {
                                    toSend += context.translate('/commands/roles/roleDeletedErr')
                                    msg.edit(toSend)
                                })
                        }
                        if (channel && channel.deletable) {
                            channel.delete()
                                .then(channel => {
                                    toSend += context.translate('/commands/roles/chanDeleted')
                                    msg.edit(toSend)
                                })
                                .catch(err => {
                                    toSend += context.translate('/commands/roles/chanDeleteErr')
                                    msg.edit(toSend)
                                })
                        }
                        roles.remove({ roleid: roledata.roleid }).write()
                        toSend += context.translate('/commands/roles/assocDeleted')

                        msg.edit(toSend)
                    })
                })()
                break
            case 'join':
                (async function () {
                    let roles = app.db.getConfig(context.server.id).get('roles', [])
                    let name: any = args.getAll(),
                        member = context.server.member(context.executor)
                    name.splice(0, 1)
                    name = name.join(' ')

                    let role = await roles.find({ name: name }).value()
                    if (!role || !context.server.roles.has(role.roleid)) return context.replyError('custom', context.translate('/commands/roles/noRole'), context.translate('/commands/roles/doesntExists'))
                    if (!role.accessible) return context.replyError('custom', context.translate('/commands/roles/privateRole'), context.translate('/commands/roles/cantAccess'))
                    if (member.roles.has(role.roleid)) return context.replyError('custom', context.translate('/errors/error'), context.translate('/commands/roles/alreadyHave'))

                    member.addRole(role.roleid).then(member => context.reply(context.translate('/commands/roles/roleGived', { name }))).catch(err => context.replyError())
                })()
                break
            case 'leave':
                (async function () {
                    let roles = app.db.getConfig(context.server.id).get('roles', [])
                    let name: any = args.getAll(),
                        member = context.server.member(context.executor)
                    name.splice(0, 1)
                    name = name.join(' ')

                    let role = await roles.find({ name: name }).value()
                    if (!role || !context.server.roles.has(role.roleid)) return context.replyError('custom', context.translate('/commands/roles/noRole'), context.translate('/commands/roles/doesntExists'))
                    if (!member.roles.has(role.roleid)) return context.replyError('custom', context.translate('/errors/error'), context.translate('/commands/roles/dontHave'))

                    member.removeRole(role.roleid).then(member => context.reply(context.translate('/commands/roles/roleRemoved', { name }))).catch(err => context.replyError())
                })()
                break
            case 'help':
                let embed = new RichEmbed()
                    .setColor(randomHexColor())
                    .setTitle(context.translate('/commands/roles/help/title'))
                    .setDescription(context.translate('/commands/roles/help/desc'))
                    .addField(context.translate('/commands/roles/help/add/title'), context.translate('/commands/roles/help/add/desc'))
                    .addField(context.translate('/commands/roles/help/delete/title'), context.translate('/commands/roles/help/delete/desc'))
                    .addField(context.translate('/commands/roles/help/list/title'), context.translate('/commands/roles/help/list/desc'))
                    .addField(context.translate('/commands/roles/help/join/title'), context.translate('/commands/roles/help/join/desc'))
                    .setFooter(context.translate('/commands/roles/help/footer'))
                context.reply(context.translate('/misc/requestOfInfo'), embed)
                break
            default:
                context.replyError('badArgs')
                break
        }

    }

}
