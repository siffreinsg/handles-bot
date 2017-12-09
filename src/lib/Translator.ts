import * as path from 'path'

declare var app
export default class Translator {
    langsPath : string = '../app/langs/'
    langContent : any = {}
    lang : string

    constructor(lang) {
        this.lang = lang
        try {
            this.langContent = require(path.resolve(__dirname, this.langsPath, lang + '.json'))
        } catch (ex) {
            throw new Error('Unreachable language file (' + lang + ')')
        }
    }

    translate(path: string) {
        try {
            let result = this.langContent, go = path.split('/')
            go.shift()

            go.forEach(function (value) {
                result = result[value]
            })
            return result
                .replace(new RegExp('{prefix}', 'g'), app.config.prefix)
                .replace(new RegExp('{botname}', 'g'), app.config.botname)
                .replace(new RegExp('{version}', 'g'), app.config.version)
                .replace(new RegExp('{lang}', 'g'), this.lang)
                .replace(new RegExp('{invite_url}', 'g'), app.invite_url)

        } catch (ex) {
            throw new Error('Unable to access translation! Lang: ' + this.lang + ', Path: ' + path)
        }
    }

    _(path: string) {
        return this.translate(path)
    }
}
