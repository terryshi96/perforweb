
import { detect } from 'detect-browser'
import { Base64 } from 'js-base64'
import metric from './metric'

class Collector {
    constructor (config = {}) {
       this.config = config
       this.detectBrowser()
    }

    detectBrowser () {
        const exist = localStorage.getItem('browser')
        if (!exist) {
            const browser = detect()
            const value = browser.name || 'unknown'
            localStorage.setItem("browser", Base64.encode(value))
        }
    }

    listen () {
        const oldOnload = window.onload
        window.onload = e => {
            if (oldOnload && typeof oldOnload === 'function') {
                oldOnload(e)
            }
            if (window.requestIdleCallback) {
                // console.log('idle')
                window.requestIdleCallback(() => metric.getMetrics(this.config))
            } else {
                setTimeout(() => metric.getMetrics(this.config))
                // console.log('timeout')
            }
        }
    }
}

export default Collector