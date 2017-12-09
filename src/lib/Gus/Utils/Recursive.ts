import * as fs from 'fs'
import * as path from 'path'

/**
 * Loop recursively the files inside a folder
 * 
 * @param dir Directory to loop inside
 * @param callback Callback function
 */
export function loopFolders(dir: string, callback : Function) {
    var cmdFiles = fs.readdirSync(dir)
    for (var i in cmdFiles) {
        var filename = path.join(dir, cmdFiles[i])
        var stat = fs.lstatSync(filename)
        if (stat.isFile()) {
            callback(dir, cmdFiles[i])
        } else if (stat.isDirectory()) {
            loopFolders(path.join(dir, cmdFiles[i]), callback)
        }
    }
}
