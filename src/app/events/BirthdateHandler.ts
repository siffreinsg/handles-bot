export default class BirthdateHandler {
    servers: any = app.db.getServers().value()
    today: Date = new Date()

    constructor() {
        for (var key in this.servers) {
            let server = this.servers[key]
            if (server.config.birthdateChan) {
                let channel: any = app.client.channels.get(server.config.birthdateChan)
                if (channel) {
                    server.users.forEach((user) => {
                        let member = app.client.users.get(user.id)
                        if (member && user.profile && user.profile.birthdate) {
                            let date = new Date(user.profile.birthdate)
                            if (date.getDate() === this.today.getDate() && date.getMonth() === this.today.getMonth()) {
                                channel.send(app.translator.translate('/events/Birthday', (server.config.lang || app.translator.defaultLang), { user: member.toString() }))
                            }
                        }
                    })
                }
            }
        }
    }
}
