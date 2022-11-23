module.exports = class Utils {
    constructor() {
        this.strings = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJLMNOPQRSTUVWXYZ'
        this.numbers = '087654321'
    }

    randomString(length) {
        let c = ''
        for(let i = 0; i < length; i++) {
            c+=this.strings[Math.floor(Math.random() * this.strings.length)]
        }
        return c
    }
}