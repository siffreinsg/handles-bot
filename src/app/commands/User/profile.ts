import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { RichEmbed } from 'discord.js'
import * as dateFormat from 'dateformat'
import { randomHexColor, replaceAll } from 'Handles/Utils/Misc'

export default class Profile extends Command {
    static activated: boolean = true
    command: string = 'profile'
    desc: string = 'Describe your personality in your profile and meet other people'
    permissions: Permission[] = []
    args: Argument[] = [
        { type: 'text', required: true }
    ]
    props: {} = {
        '--inline': Boolean,
        '-i': '--inline'
    }
    allowDM: boolean = false
    aliases: string[] = ['profil', 'social']
    usage: string = 'profile help'

    execute(context: Context, args: Arguments) {
        let data = args.getAll()
        this.setDateFormat(context)

        switch (args.get(0)) {
            case 'set':
                if (args.get(1) && args.get(2)) {
                    let profile: any = app.db.createIfNotExists(app.db.getUser(context.server.id, context.executor.id), 'profile', {}),
                        profileConf: any = app.db.createIfNotExists(app.db.getConfig(context.server.id), 'profiles', {}).value(),
                        key: any = ('' + args.get(1)).toLowerCase()

                    data.splice(0, 2)
                    let value: any = data.join(' ')

                    if (!profileConf[key] || value.length > 2040 || (profileConf[key].regex && !new RegExp(profileConf[key].regex).test(value))) return context.replyError('badArgs')

                    profile.set(key, value).write()
                    context.reply(context.translate('/commands/profile/saved'))
                } else {
                    return context.replyError('badArgs')
                }
                break
            case 'unset':
                if (args.get(1)) {
                    let profile: any = app.db.createIfNotExists(app.db.getUser(context.server.id, context.executor.id), 'profile', {}),
                        profileConf: any = app.db.createIfNotExists(app.db.getConfig(context.server.id), 'profiles', {}).value(),
                        key: any = args.get(1)

                    if (!profileConf[key] && !profile.has(key).value()) return context.replyError('badArgs')

                    profile.unset(key).write()
                    context.reply(context.translate('/commands/profile/deleted'))
                } else {
                    return context.replyError('badArgs')
                }
                break
            case 'view':
                let requested = context.message.mentions.members.first() || context.server.member(context.executor),
                    profile = app.db.createIfNotExists(app.db.getUser(requested.guild.id, requested.id), 'profile', {}).value(),
                    profileConf = app.db.createIfNotExists(app.db.getConfig(context.server.id), 'profiles', {}).value()

                let embed = new RichEmbed()
                    .setColor(requested.displayHexColor)
                    .setAuthor(context.translate('/commands/profile/profileOf', { user: requested.displayName }), requested.user.avatarURL)

                for (var key in profile) {
                    let value = profile[key]
                    if (key === 'birthdate') value = dateFormat(profile[key], context.translate('/misc/dateFormat'))
                    if (profileConf[key] || key === 'birthdate')
                        embed.addField(
                            replaceAll((key === 'birthdate' ? context.translate('/commands/profile/birthdate') : key).capitalize(), ['-', '_'], [' ', ' '])
                            , '' + value, (key === 'birthdate' || profileConf[key].inline)
                        )
                }
                context.reply(context.translate('/misc/requestOfInfo'), embed)
                break
            case 'config':
                if (!context.isAdmin()) return context.replyError('notAdmin')
                if (!args.get(1)) return context.replyError('badArgs')

                if (args.get(1) === 'add') {
                    let profiles = app.db.createIfNotExists(app.db.getConfig(context.server.id), 'profiles', {}),
                        name = ('' + args.get(2)).toLowerCase(),
                        inline = args.getProp('--inline') || false

                    if (!args.get(2) || !new RegExp('^[a-zA-Z0-9_-]*$').test(name)) return context.replyError('badArgs')
                    if (profiles.has(name).value()) return context.replyError('custom', context.translate('/commands/profile/cantAdd'), context.translate('/commands/profile/alreadyExists'))
                    if (profiles.size().value() > 23) return context.replyError('custom', context.translate('/commands/profile/cantAdd'), context.translate('/commands/profile/max'))

                    data.splice(0, 3)
                    let regex = data.join(' ') || undefined

                    profiles.set(name, { inline, regex }).write()
                    context.reply(context.translate('/commands/profile/added', { name }))
                } else if (args.get(1) === 'remove') {
                    let profiles = app.db.createIfNotExists(app.db.getConfig(context.server.id), 'profiles', {}),
                        name = ('' + args.get(2)).toLowerCase()

                    if (!profiles.has(name).value()) return context.replyError('custom', context.translate('/commands/profile/cantRemove'), context.translate('/commands/profile/doesntExist'))

                    profiles.unset(name).write()
                    context.reply(context.translate('/commands/profile/cfgDeleted'))
                } else {
                    return context.replyError('badArgs')
                }
                break
            case 'help':
                (function () {
                    let availables = app.db.createIfNotExists(app.db.getConfig(context.server.id), 'profiles', {}).keys().value().join(', ')

                    let embed = new RichEmbed()
                        .setColor(randomHexColor())
                        .setTitle(context.translate('/commands/profile/help/describeYourself'))
                        .addField('profile config', context.translate('/commands/profile/help/config') + '\n`' + app.config.prefix + 'profile config add <name> [regex] [--inline]\n' + app.config.prefix + 'profile config remove <name>`')
                        .addField('profile set', context.translate('/commands/profile/help/set') + '\n`' + app.config.prefix + 'profile set <input> <value>`\n' + (availables.length > 0 ? context.translate('/commands/profile/help/availables', { availables }) : ''))
                        .addField('profile unset', context.translate('/commands/profile/help/unset') + '\n`' + app.config.prefix + 'profile unset <input>`')
                        .addField('profile view', context.translate('/commands/profile/help/view') + '\n`' + app.config.prefix + 'profile view [@user]`')
                        .addField('birthdate', context.translate('/commands/profile/help/birthdate') + '\n`' + app.config.prefix + 'birthdate DD MM YYYY`')
                        .setFooter(context.translate('/misc/bracketsAndQuotes'))
                    context.reply(context.translate('/misc/requestOfInfo'), { embed })
                })()
                break
            default:
                return context.replyError('badArgs')
        }
    }

    setDateFormat(context) {
        dateFormat.i18n = {
            dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            timeNames: ['a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM']
        }

        for (let i = 7; i < 14; i++) {
            dateFormat.i18n.dayNames[i] = context.translate('/misc/days/' + dateFormat.i18n.dayNames[i - 7].toLowerCase())
        }
        for (let j = 12; j < 24; j++) {
            dateFormat.i18n.monthNames[j] = context.translate('/misc/months/' + dateFormat.i18n.monthNames[j - 12].toLowerCase())
        }
    }
}
