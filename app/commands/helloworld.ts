import * as Discord from 'discord.js'

declare var app
export default class HelloWorld {
    public command : string = 'hello'
    public desc : string = 'Simple test command.'
    public args = [
        {type: 'text', required: false, usage: 'nom'}
    ]
    
    execute(args, message){
        console.log(args)
        message.channel.send(this.textToSay(args))
    }
    
    textToSay(args) {
        if (!args._[0]) args._[0] = app.translator._('/commands/helloworld/world')
        return app.translator._('/commands/helloworld/hello').replace('{who}', args._[0])
    }
    
}
