import { GuildMember, Guild, RichEmbed } from 'discord.js'
import { randomHexColor, replaceAll } from 'Handles/Utils/Misc'

export default class JoinHandler {
    member: GuildMember
    guild: Guild

    constructor(member: GuildMember) {
        this.member = member
        this.guild = member.guild

        let joinmsg = app.db.getConfig(this.guild.id).get('joinmsg').value()
        if (joinmsg && joinmsg.enabled) {
            let search = [
                '{prefix}',
                '{botname}',
                '{version}',
                '{lang}',
                '{invite_url}',
                '{user}',
                '{username}',
                '{servername}',
                '{owner}',
                '{ownername}'
            ]
            let replacement = [
                app.config.prefix,
                app.config.botname,
                app.config.version,
                app.translator.defaultLang,
                app.invite_url,
                this.member,
                this.member.displayName,
                this.guild.name,
                this.guild.owner,
                this.guild.owner.displayName
            ]

            let embed = new RichEmbed()
                .setColor(randomHexColor())
                .setAuthor(replaceAll(joinmsg.title, search, replacement) || 'Welcome to the server !', this.guild.iconURL)
                .setDescription(replaceAll(joinmsg.body, search, replacement))
            member.send('', embed)
        }
    }
}
