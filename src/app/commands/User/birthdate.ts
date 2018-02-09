import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission
import * as dateFormat from 'dateformat'

export default class Setbirthdate extends Command {
    static activated: boolean = true
    command: string = 'setbirthdate'
    desc: string = 'Set your birthdate.'
    permissions: Permission[] = []
    args: Argument[] = [
        { type: 'text', required: false },
        { type: 'text', required: false },
        { type: 'text', required: false }
    ]
    allowDM: boolean = false
    aliases: string[] = ['birthdate', 'birth']
    usage: string = 'setbirhtdate DD MM YYYY\nsetbirthdate setchannel #channel'

    execute(context: Context, args: Arguments) {
        context.delete()
        this.setDateFormat(context)
        if (['channel', 'setchannel', 'announce'].indexOf('' + args.get(0)) !== -1) {
            if (context.isAdmin()) {
                let channel = context.message.mentions.channels.first()
                if (!channel || !channel.id) {
                    app.db.getConfig(context.server.id).unset('birthdateChan').write()
                    return context.reply('Birth dates will not be announced anymore !')
                } else {
                    app.db.getConfig(context.server.id).set('birthdateChan', channel.id).write()
                    return context.reply('Birth dates will now be announced in the channel ' + channel.toString() + ' !')
                }
            } else return context.replyError('notAdmin')
        }

        if (!args.get(0) || !args.get(1) || !args.get(2)) return context.replyError('badArgs')

        let member = context.server.member(context.executor),
            user = app.db.createIfNotExists(app.db.getUser(member.guild.id, member.id), 'profile', { birthdate: '' }),
            day = parseInt('' + args.get(0)),
            month = parseInt('' + args.get(1)),
            year = parseInt('' + args.get(2))

        if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month > 12 || month < 1 || year < 1900 || year >= new Date().getFullYear()) return context.replyError('badArgs')

        let date = new Date(year, month - 1, day)
        user.set('birthdate', date).write()
        context.reply('Birthate set to ' + dateFormat(date, context.translate('/misc/dateFormat')))
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
