import * as Discord from 'discord.js'

declare var app
export default class Help {
    static command : string = 'help'
    static desc : string = ''
    static args = [
        {type: 'text', required: true, usage: 'nom'} 
    ]
    
    execute(args, message){
        message.channel.send(app.translator._('/commands/help/message'))
    }
}
