
class Utils {
    log (message, status = false) {
        if (status) {
            console.log(message)
        }
    }
}
let utils = new Utils()
export default utils