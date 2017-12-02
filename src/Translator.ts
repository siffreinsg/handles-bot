import * as path from 'path'

export default class Translator {
    langsPath : string = '../app/langs/'
    langContent : any = {}

    constructor(lang) {
        this.langContent = require(path.resolve(__dirname, this.langsPath, lang + '.json'))
    }

    translate(path: string) {
        let result = this.langContent, go = path.split('/')
        go.shift()

        go.forEach(function (value) {
            result = result[value]
        })
        return result
    }

    _(path: string) {
        return this.translate(path)
    }
}
