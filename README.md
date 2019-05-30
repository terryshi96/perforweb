```
import { Monitor } from perforweb
const config = {
  list: {
      entryTypes: ['paint', 'navigation']
  },
  log: true,
  influxdb: {
      status: true,
      host:
      port:
      username:
      password:
  }
}
Monitor.observer.observe(config)
```