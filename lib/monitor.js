import { Utils } from './utils'
class Monitor {
    constructor (config = {}) {
       this.config = config
       this.observer = new PerformanceObserver(this.logger)
    }

    logger (list, observer) {
        for (const entry of list.getEntries()) {
            // `entry` is a PerformanceEntry instance.
      
            console.log(entry)
      
          }
    }

    getPaintTiming (entry) {

    }

    getResourceTiming () {

    }

    getLongTask () {

    }

    getNavigationTiming () {

    }

}

export default Monitor
