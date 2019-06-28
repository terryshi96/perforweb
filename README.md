```
import Collector from './collector'
const config = {
  list: ['resource', 'navigation'],
  timeout: 10,
  influxdb: {
    host: 'localhost',
    port: 8086,
    database: 'test',
    username: 'admin',
    password: 'admin'
  }
}
let c = new Collector(config)
c.listen()
```