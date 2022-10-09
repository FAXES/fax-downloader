const fs = require('fs');
const path = require('path');

module.exports.getFile = (url, dest, options) => new Promise((resolve, reject) => {
    const req = url.trim().startsWith('https') ? require('https') : require('http');
    req.get(url, options || null, (res) => {
        if(res.statusCode !== 200) {
            res.resume();
            return reject(console.warn(`Request Failed.\nStatus Code: ${res.statusCode}`));
        }
        res.pipe(fs.createWriteStream(path.dirname(require.main.filename)+'/'+dest))
        .on('error', (err) => reject(console.warn(`Request Failed. Error:\n${err}\n`)))
        .once('close', () => resolve({filename: dest, dir:path.dirname(require.main.filename)+'/'+dest}));
    })
    .on('timeout', (err) => reject(console.warn(`Request Failed. Timeout:\n${err}\n`)))
    .on('error', (err) => reject(console.warn(`Request Failed. Error:\n${err}\n`)));
})