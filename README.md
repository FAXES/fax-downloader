# File Downloader

Download files from URLs with file-dl. This works for image downloads and any file that is hosted an a CDN.


### Params
- url *(required)* - The file/image URL
- dest *(required)* - The destination from the node process location to save the file too.

### Options (Object)
- timeout *(required)* - Timeout in ms of the HTTP request timeout

### Example Usage

```js
const filedl = require('filedl');
filedl.getFile('https://faxes.zone/i/2RwpF.png', 'my-new-file.png') // Downloads file via Promise to location.

// Console log return: {filename: 'my-new-file.png', dir:'/home/nodeapp/my-new-file.png'}
```

### License
Under the [MIT license]()
