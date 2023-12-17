const fs = require('fs');
const path = require('path');

module.exports.getFile = (url, dest, options = {}) => new Promise((resolve, reject) => {
    const req = url.trim().startsWith('https') ? require('https') : require('http');
    req.get(url, options, (res) => {
        if(res.statusCode !== 200) {
            res.resume();
            resolve({status: res.statusCode, error: res.statusCode})
        }
        res.pipe(fs.createWriteStream(path.dirname(require.main.filename)+'/'+dest))
        .on('error', (err) => resolve({status: res.statusCode, error: err}))
        .once('close', () => resolve({dest: dest, status: res.statusCode}));
    })
    .on('timeout', (err) => resolve({status: 408, error: err}))
    .on('error', (err) => resolve({status: 400 || 500, error: err}));
})
