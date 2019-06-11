import { InfluxDB } from 'influx'

class Sender {
    constructor (config) {
        if (config.hasOwnProperty('influxdb')) {
            const t = config.influxdb
            this.client = new InfluxDB ({
                host: t.host,
                port: t.port,
                database: t.database,
                username: t.username,
                password: t.password
            })
            // this.client.getDatabaseNames().then(names => {
            //     if (!names.includes(t.database)) {
            //       return this.client.createDatabase(t.database)
            //     }
            // })
        }
    }

    postToInfluxdb (sum) {
        let data = []
        for (const item of sum) {
            switch(item.entryType) {
                case 'navigation':
                    data.push({
                        measurement: 'navigation',
                        tags: {
                            browser: item.browser,
                            city: item.city,
                            country_name: item.country_name,
                            ip: item.ip,
                            latitude: item.latitude,
                            longitude: item.longitude,
                            name: item.name,
                            region: item.region
                        },
                        fields: {
                            dns: item.dns,
                            tcp: item.tcp,
                            domComplete: item.domComplete,
                            domInteractive: item.domInteractive,
                            firstContentfulPaintTime: item.firstContentfulPaintTime,
                            firstPaintTime: item.firstPaintTime,
                            load: item.load,
                            request: item.request,
                            response: item.response
                        }
                    })
                    break
                case 'resource':
                    data.push({
                        measurement: 'resource',
                        tags: {
                            browser: item.browser,
                            city: item.city,
                            country_name: item.country_name,
                            ip: item.ip,
                            name: item.name,
                            region: item.region
                        },
                        fields: {
                            dns: item.dns,
                            tcp: item.tcp,
                            load: item.load,
                            request: item.request,
                            response: item.response
                        }
                    })
                    break
            }
        }
        // console.log(data)
        this.client.writePoints(data)
    }
}


export default Sender