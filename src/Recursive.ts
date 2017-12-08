import * as fs from 'fs'
import * as path from 'path'

export default class Recursive {
    static folderlooper(dir: string, callback : Function) {
        var cmdFiles = fs.readdirSync(dir)
        for (var i in cmdFiles) {
            var filename = path.join(dir, cmdFiles[i])
            var stat = fs.lstatSync(filename)
            if (stat.isFile()) {
                callback(dir, cmdFiles[i])
            } else if (stat.isDirectory()) {
                this.folderlooper(path.join(dir, cmdFiles[i]), callback)
            }
        }
    }
}
