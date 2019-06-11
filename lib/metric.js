import utils from './utils'
import { Base64 } from 'js-base64'
import Cookies from 'js-cookie'
import axios from 'axios'
import Sender from './sender'
import geohash from 'ngeohash'
import { SSL_OP_EPHEMERAL_RSA } from 'constants';

class Metric {
    getMetrics(config) {
        const exist = Cookies.get('geo')
        if (!exist) {
            axios.get('https://api.ipify.org?format=json').then((res) => {
                   const ip = res.data.ip
                   axios.get(`https://ipapi.co/${ip}/json/`).then((res) => {
                        const t = res.data
                        const geo = {
                            ip: t.ip,
                            city: t.city,
                            country: t.country,
                            country_name: t.country_name,
                            region: t.region,
                            geohash: geohash.encode(t.latitude, t.longitude),
                            // latitude: t.latitude,
                            // longitude: t.longitude,
                            org: t.org
                        }
                        Cookies.set('geo', Base64.encode(JSON.stringify(geo)), { expires: 1 })
                        this.getEntry(config)
                   }).catch((e) => {
                    console.log(e)
                  })
              }).catch((e) => {
                console.log(e)
              })
        } else {
            this.getEntry(config)
        }
    }

    getEntry(config) {
        let sum = []
        for (const entry of config.list) {
            switch(entry) {
                case 'navigation':
                    sum.push(this.getNavigationTiming(config))
                    break
                case 'resource':
                    sum.push.apply(sum, this.getResourceTiming(config))
                    break
            }
          }
        const sender = new Sender(config)
        sender.postToInfluxdb(sum)
        utils.log(sum, config.log)
    }

    getResourceTiming (config) {
        const temp = performance.getEntriesByType('resource')
        const geo = JSON.parse(Base64.decode(Cookies.get('geo')))
        const timeout = config.timeout || 1000
        let data = []
        for (const item of temp) {
            if (item.responseEnd - item.startTime > timeout) {
                const resource = {
                    entryType: item.entryType,
                    name: item.name.split('?')[0],
                    dns: item.domainLookupEnd - item.domainLookupStart,
                    tcp: item.connectEnd - item.connectStart,
                    request: item.responseStart - item.requestStart,
                    response: item.responseEnd - item.responseStart,
                    load: item.responseEnd - item.startTime,
                    browser: Base64.decode(localStorage.getItem("browser")),
                    ip: geo.ip,
                    city: geo.city,
                    region: geo.region,
                    country_name: geo.country_name,
                }
                data.push(resource)
            }
        }
        return data
    }

    getNavigationTiming (config) {
        const navigation = performance.getEntriesByType('navigation')[0]
        const paint = performance.getEntriesByType('paint')
        const geo = JSON.parse(Base64.decode(Cookies.get('geo')))
        const data = {
            entryType: navigation.entryType,
            name: navigation.name.split('?')[0],
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            request: navigation.responseStart - navigation.requestStart,
            response: navigation.responseEnd - navigation.responseStart,
            firstPaintTime: paint[0].startTime,
            firstContentfulPaintTime: paint[1].startTime,
            domInteractive: navigation.domInteractive,
            domComplete: navigation.domComplete,
            load: navigation.duration,
            browser: Base64.decode(localStorage.getItem("browser")),
            ip: geo.ip,
            city: geo.city,
            region: geo.region,
            country_name: geo.country_name,
            geohash: geo.geohash
        }
        return data
    }

    // todo
    // getLongTask () {
    //     performance.getEntriesByType('longTask')
    // }

}
let metric = new Metric()
export default metric