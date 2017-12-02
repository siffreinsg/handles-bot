import * as fs from 'fs'
import * as path from 'path'
import * as Discord from 'discord.js'
import * as JsonDB from 'node-json-db'
import * as ora from 'ora'
import Config from './Config'
import Commands from './Commands'
import MessageHandler from '../app/events/MessageHandler'
import Translator from './Translator'

declare var global
export default class Application {
  config : any
  db: JsonDB
  commands : Commands
  client : Discord.Client
  translator : Translator
  invite_url : string

  /**
   * Initialize the bot.
   */
  constructor(){
    this.load()
    this.prepareBot()
    this.eventBot()
    this.run()
  }

  /**
   * Set the global variables of the bot.
   */
  load(){
    this.config = new Config()
    this.db = new JsonDB('GusDB', true, false)
    this.translator = new Translator(this.config.lang)
  }

  /**
   * Prepare the bot to be run.
   */
  prepareBot(){
    console.log(' -- ' + this.config.botname + ' ' + this.config.version + ' - powered by Gus Inc. -- \n')
    this.client = new Discord.Client({
      restTimeOffset: 1000,
      // disabledEvents: ['GUILD_CREATE', 'GUILD_DELETE', 'CHANNEL_PINS_UPDATE', 'USER_NOTE_UPDATE', 'TYPING_START', 'VOICE_SERVER_UPDATE', 'VOICE_STATE_UPDATE']
      disabledEvents: ['TYPING_START']
    })
  }

  /**
   * Initialize the bot after run.
   */
  initBot(){
    this.commands = new Commands()
    this.invite_url = 'https://discordapp.com/oauth2/authorize?client_id=' + this.client.user.id + '&scope=bot&permissions=2146958591'

    console.log(Object.keys(this.commands.list).length + ' commands loaded.')
    console.log('\nInvite me on a server by using this link: ' + this.invite_url + ' \n')
    this.client.user.setGame(this.config.status.replace('{prefix}', this.config.prefix))
  }

  /**
   * Initialize the events listeners
   */  
  eventBot(){
    this.client.on('message', msg => new MessageHandler(msg))
    // this.client.on('init', this.initBot)
  }
  
  /**
   * Just run the bot. No more.
   */
  run(){
    let loginSpin = ora('Logging in...').start()

    this.client.login(this.config.discordAPItoken)
    .then(() => {
      var servers = this.client.guilds.array().length
      loginSpin.succeed('Logged in as ' + this.client.user.username + ' in ' + servers + ' server' + (servers !== 1 ? 's' : '') + '.')
    }).then(() => this.initBot())
    .catch(ex => {
      loginSpin.fail('Login failed. Error: ' + ex.message)
      console.log(ex)
    })
  }

}
