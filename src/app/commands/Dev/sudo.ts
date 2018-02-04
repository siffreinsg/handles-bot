import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import { replaceAll } from 'Handles/Utils/Misc'

export default class Sudo extends Command {
    static activated: boolean = true
    command: string = 'sudo'
    desc: string = 'God mode.'
    permissions: Permission[] = [
        'SUPER_ADMIN'
    ]
    args: Argument[] = [
        { name: 'action', type: 'text', required: true, usage: 'action' }
    ]
    allowDM: boolean = true
    aliases: string[] = []
    usage: string = 'sudo weird stuff'

    execute(context: Context, args: Arguments) {
        let member = context.server.member(context.executor)
        context.delete()
        switch ('' + args.get(0)) {
            case 'getrolesid':
                (async function () {
                    let toSend = 'Available roles in the server ' + member.guild.name + ': \n\n'
                    await member.guild.roles.array().forEach((role, index) => {
                        toSend += '   - ' + role.name + ' | ID= ' + role.id + ' \n'
                    })
                    context.reply(replaceAll(toSend, '@everyone', 'everyone'), { split: true })
                })()
                break
            case 'joinrole':
                (function () {
                    let asked = context.message.content.toString().split(' ')[2]
                    if (!asked) return context.replyError('badArgs')
                    if (!member.guild.roles.has(asked)) return context.reply('ERROR: This role doesn\'t exist in this server !')
                    if (member.roles.has(asked)) return context.reply('ERROR: You already have this role !')
                    member.addRole(asked).then(member => context.reply('SUCCESS: You now have the role !')).catch(err => context.replyError())
                })()
                break
            case 'halt':
                (async function () {
                    await context.reply(context.translate('/commands/halt'))
                    process.exit(0)
                })()
                break
            case 'setactivity':
                (async function () {
                    let data = args.getAll()
                    data.splice(0, 1)
                    let activity = args.get(1) ? data.join(' ') : app.config.activity.replace('{prefix}', app.config.prefix)

                    await app.client.user.setActivity(activity)
                    context.reply(context.translate('/commands/setactivity'))
                })()
                break
            case 'help':
                context.executor.send(
                    'You need the SUPER_ADMIN permission to execute this command !\n\n' +
                    '   - `sudo getrolesid`: *Get ids of availables roles in the server.*\n' +
                    '   - `sudo joinrole <role id>`: *Get a role in a server.*\n' +
                    '   - `sudo halt`: *Shutdown the bot.*\n' +
                    '   - `sudo error [type] [title] | [desc]`: *Generate an error* **(Notice the | separating the title and the description)**.\n' +
                    '   - `sudo setactivity [new activity]`: *Change or reset the bot\'s activity.*\n' +
                    '   - `sudo help`: *Display this message.*'
                )
                break
            default:
                return context.replyError('badArgs')
        }
    }

}
