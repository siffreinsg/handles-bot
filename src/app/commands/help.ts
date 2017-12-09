import * as Discord from 'discord.js'

export default class Help {
    public command : string = 'help'
    public desc : string = ''
    public args = [
        {type: 'text', required: true, usage: 'nom'} 
    ]
    
    execute(args, message){
        if (args._[0] !== 'list') {
            message.channel.send(app.translator._('/commands/help/message'))
        } else {
            let toSend = app.translator._('/commands/help/available')
            app.commands.list.forEach(function (cmd) {
                if (cmd !== 'help') {
                    cmd = app.commands.cmds[cmd]
                    toSend += '\n    - `' + app.config.prefix + cmd.command + '` • ' + cmd.desc 
                }
            })
            toSend += '\n\n' + app.translator._('/commands/help/fullist')
            message.channel.send(toSend + '\.')
        }
    }
}
