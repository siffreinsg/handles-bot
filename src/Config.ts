import * as fs from 'fs'

export default class Config {
    config : any = {}
    keys = {
        'discordAPItoken': 'string',
        'botname': 'string',
        'version': 'string',
        'prefix': 'string',
        'lang': 'string'
    }

    /**
     * Initialize configuration.
     */
    constructor(){
        this.loadConfig()
        this.checkKeys()
        return this.config
    }

    /**
     * Load the configuration file.
     */
    loadConfig(){
        try {
            try {
                this.config = require('../config.dev.json')
            } catch (ex) {
                this.config = require('../config.json')
            }
        } catch (ex) {
            console.error('Configuration error: ' + ex)
            process.abort()
        }
    }

    /**
     * Check if configuration keys are valid.
     */
    checkKeys(){
        try{
            for (var key in this.config) {
                this.checkKey(key)
            }
        } catch (ex) {
        	console.error('Configuration error: ' + ex)
        	process.abort()
        }
    }

    /**
     * Check if a configuration key is valid.
     * 
     * @param key Configuration key
     */
    checkKey(key){
        var value = this.config[key]
        if (this.keys[key]) {
            if (this.keys[key] === 'string') {
                if (typeof value !== 'string') { throw '"'+key+'" property must be a doublequoted text.' }
            } else if (this.keys[key] === 'array') {
                if (!(value instanceof Array)) { throw '"'+key+'" property must be an unordered list.' }
            } else throw '"' + key + '" is not a valid property.'
        } else throw '"' + key + '" is not a valid property.'
    }
}
