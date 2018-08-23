function randomString(len) {
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    const charsLength = chars.length
    let result = ''
    for (var i = 0; i < len; i++) {
        result += chars[Math.floor(Math.random() * charsLength)]
    }
    return result;
}

module.exports = {
    randomString
}
