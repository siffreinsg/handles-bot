import * as Discord from 'discord.js'

declare var app
export default class HelloWorld {
    static command : string = 'hello'
    static desc : string = ''
    static args = [
        {type: 'text', required: true, usage: 'nom'} 
    ]
    
    execute(args, message){
        message.channel.send(this.textToSay(args))
    }
    
    textToSay(args) {
        if (!args._[0]) args._[0] = app.translator._('/commands/helloworld/world')
        return app.translator._('/commands/helloworld/hello').replace('{who}', args._[0])
    }
    
}
