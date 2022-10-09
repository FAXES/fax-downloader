# File Downloader

Download files from URLs and save to a defined location. Downloading file just got that little easier.


### Params
- url *(required)* - The file/image URL
- dest *(required)* - The destination from the node process location to save the file too.

### Options (Object)
Other options can include those within HTTP.request - https://nodejs.org/api/http.html#httprequestoptions-callback

### Example Usage

```js
let options = {
    url: `http://your.domain`,
    dest: `/save/location`,
}
faxDl.getFile(options.url, options.dest, /*{other: options}*/).then(function({filename}) {
    // Do something cool with the downloaded file.
});
```

### License
Under the [MIT license](https://github.com/FAXES/filedl/blob/main/LICENSE.md)
