export default function BirthdateHandler() {
    let servers = app.db.getServers().value()
    let today = new Date()

    for (var key in servers) {
        let server = servers[key]
        if (server.config.birthdateChan) {
            let channel: any = app.client.channels.get(server.config.birthdateChan)
            if (channel) {
                server.users.forEach((user) => {
                    let member = app.client.users.get(user.id)
                    if (member && user.profile && user.profile.birthdate) {
                        let date = new Date(user.profile.birthdate)
                        if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth()) {
                            channel.send(app.translator.translate('/events/Birthday', (server.config.lang || app.translator.defaultLang), { user: member.toString() }))
                        }
                    }
                })
            }
        }
    }
}
