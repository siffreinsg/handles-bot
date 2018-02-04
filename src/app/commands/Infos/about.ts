import * as Discord from 'discord.js'
import Command from 'Handles/Command/CommandHandler'
import Context from 'Handles/Command/CommandContext'
import Arguments from 'Handles/Utils/Arguments'
import Argument = Handles.CommandArgument
import Permission = Handles.CommandPermission

export default class About extends Command {
    static activated: boolean = true
    command: string = 'about'
    desc: string = 'Informations about me'
    permissions: Permission[] = []
    args: Argument[] = []
    allowDM: boolean = true
    aliases: string[] = ['info', 'infos']
    usage: string = 'about'

    execute(context, args) {
        let embed = new Discord.RichEmbed()
            .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
            .addField(context.translate('/commands/about/createdBy'), 'The Orient Express', true)
            .addField('NodeJS', '[v8.x](https://nodejs.org)', true)
            .addField('Discord.js', '[v11.3.0](https://discord.js.org)', true)
            .addField(context.translate('/commands/about/aboutTitle'), context.translate('/commands/about/about'))
        context.reply(context.translate('/misc/requestOfInfo'), embed)

    }
}
