import * as fs from 'fs'
import * as path from 'path'
import * as Discord from 'discord.js'
import { Observable } from 'rxjs/Observable'
import Translator from './Translator'
import Config from './Loaders/Config'
import Commands from './Loaders/Commands'
import MessageHandler from '../../../app/events/MessageHandler'
import Listr = require('listr')
import 'colors'

export default class Application {
  config : any
  package: any
  commands : Commands
  client : Discord.Client
  translator : Translator
  invite_url : string

  /**
   * Initialize the bot.
   */
  constructor(){

    this.runTasks()
    .then((ctx) => {
      this.initBot()
    })
    .catch((err) => {
      this.apologizeForFailure(err)
    })

  }

  /**
   * Run the tasks and return a promise
   */
  runTasks() : Promise<any> {
    return (new Listr([

      {
        title: 'Initializing Discord client',
        task: (ctx_, task_) => {
          return new Listr([

            {
              title: 'Preparing client',
              task: (ctx, task) => {
                this.prepareClient()
                task.title = 'Prepared client'
              }
            },

            {
              title: 'Registering events',
              task: (ctx, task) => {
                this.registerEvents()
                task.title = 'Registered events'
                task_.title = 'Initialized Discord client'
              }
            }

          ])
        }
      },

      {
        title: 'Initialize Gus',
        task: (ctx_, task_) => {
          return new Listr([

            {
              title: 'Retrieving package informations',
              task: (ctx, task) => {
                this.package = require('../../../../package.json')
                task.title = 'Retrieved package informations'
              }
            },

            {
              title: 'Loading configuration',
              task: (ctx, task) => {
                this.config = new Config()
                task.title = 'Loaded configuration'
              }
            },

            {
              title: 'Loading translations',
              task: (ctx, task) => {
                this.translator = new Translator(this.config.lang)
                task.title = 'Loaded translations'
              }
            },
            
            {
              title: 'Loading commands',
              task: (ctx, task) => {
                this.commands = new Commands()
                task.title = 'Loaded ' + Object.keys(this.commands.list).length + ' commands'
                task_.title = 'Initialized Gus'
              }
            }

          ])
        }
      },

      {
        title: 'Log in to Discord API',
        task: (ctx, task) => {
          return new Observable(observer => {
            this.client.login(this.config.discordAPItoken)
            .then(() => {

              var servers = this.client.guilds.array().length
              task.title = 'Logged in as ' + this.client.user.username + ' in ' + servers + ' server' + (servers !== 1 ? 's' : '')
              observer.complete()

            })
            .catch(ex => {

              observer.error()
              task.output = 'Login failed. Error: ' + ex.message

            })
          })
        }
      }
      
    ], {
      collapse: false
    })).run()
  }

  /**
   * Prepare the client to be used by Gus.
   */
  prepareClient(){
    this.client = new Discord.Client({
      restTimeOffset: 1000,
      // disabledEvents: ['GUILD_CREATE', 'GUILD_DELETE', 'CHANNEL_PINS_UPDATE', 'USER_NOTE_UPDATE', 'TYPING_START', 'VOICE_SERVER_UPDATE', 'VOICE_STATE_UPDATE']
      disabledEvents: ['TYPING_START']
    })
  }
  
  /**
   * Registering the events listeners
   */  
  registerEvents(){
    this.client.on('message', msg => new MessageHandler(msg))
    // this.client.on('init', this.initBot)
  }
  
  /**
   * Initialize the bot after run.
   */
  initBot(){

    var logo =
    (`
                   ,......                                   
                ,+:::::::::+                          
              ;:::'+++++++;::'  :; '''':+             
             +::+++#++,,,,,''::++:+'''''',:'          
            ;::+++#+',,,,,,,,+::::''''';+   +         
            +::++#+,,,,,,,,,,+::+,'         +         
            +::++;,,,,,,,,,,,+::;           '         
             ;:;+,,,,,,,,,,,+::+           +          
              '::++,,,,,,,;+::+           +           
                ':::;'+'::::'            ;            
                   '''''''               '            
                                         +         +  
                                          '       +   
                                           +.  .+,    
                                             ''       `)
    // End of logo
    // Please don't destroy this, it took us hours to do.


    console.log(
      '\n' + logo.blue +
      '\n' + (' ').repeat(16 - this.package.version.length) +
      `-- Gus ${this.package.version} - Proudly maintained by Gus Project --\n`.bold
    )
    
    
    this.invite_url = 'https://discordapp.com/oauth2/authorize?client_id=' + this.client.user.id + '&scope=bot&permissions=8'
    
    console.log(
      `Call me Gus. You can invite me on a server using the link below.\n`.green +
      `${this.invite_url}\n`
    )

    this.client.user.setGame(this.config.status.replace('{prefix}', this.config.prefix))
  }

  /**
   * Apologize if there is an error.
   * @param err Error
   */
  apologizeForFailure(err){

    console.error(`\nCall me Gus. I'm afraid the starting process didn't worked as expected. We apologize for any distress you may have just experienced.\n`.red)
  
  }

}
