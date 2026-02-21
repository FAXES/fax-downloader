# File Downloader

Download files from URLs and save them locally with a simple API.
Built using modern fetch(), so this package requires node version 18 and above.

✅ Stream downloads directly to disk
✅ Promise-based API
ℹ️ Optional request configuration
🐃 Buffer download support via `getSync()`
⚠️ Requires Node.js 18+ (native `fetch()` support)

## Installation

```
npm install file-downloader
```

## Functions

### `getBuffer(url, options?)`
Downloads a remote file and returns its data as a Buffer.

| Name      | Type     | Required | Description   |
| --------- | -------- | -------- | ------------- |
| `url`     | `string` | ✅        | File URL      |
| `options` | `object` | ❌        | Fetch options |

**Example Usage**
```js
const faxDl = require('fax-downloader');
(async () => {
    const result = await faxDl.getSync("https://example.com/file.json");
    if(result.data) {
        console.log(result.data.toString());
    }
})();
```

**Response Object**
```js
{
    status: number,
    data: Buffer,   // returned when successful
    error: any
}
```

### `getFile(url, dest, options?)` (deprecated)
Downloads a file from a URL and saves it to disk. This function always resolves (never rejects) to maintain compatibility with previous versions (1.x.x).

| Name      | Type     | Required | Description                                              |
| --------- | -------- | -------- | -------------------------------------------------------- |
| `url`     | `string` | ✅        | File URL to download                                     |
| `dest`    | `string` | ✅        | Destination path relative to the Node process entry file |
| `options` | `object` | ❌        | Fetch request options                                    |

**Example Usage**
```js
const faxDl = require('fax-downloader');

faxDl.getFile(
    "https://example.com/image.png",
    "/downloads/image.png"
    )
    .then((fileResult) => {
        /*
        fileResult = {
            dest: "/downloads/image.png",
            status: 200,
            error: undefined
        }
        */
        console.log(fileResult);
    });
```

**Response Object**
```js
{
    dest: string,     // destination path (on success)
    status: number,   // HTTP status code
    error: any        // error object or status code if failed
}
```

> ⚠️ Errors resolve instead of throwing to preserve legacy compatibility.

---

**Options**
Any standard Fetch API options may be used including but not limited to; headers, method, signal, timeouts.
https://developer.mozilla.org/en-US/docs/Web/API/fetch


**Path Behaviour (getFile)**
Files are saved relative to `path.dirname(require.main.filename)`.


**Error Handling**
This package intentionally does not reject Promises. This design is intended to allow applications to read the response and not throw errors. 

```js
{
    status: HTTP_CODE,
    error: ERROR_OBJECT
}
```

### Authors
Markdownconvert is created by [Weblutions & FAXES](https://weblutions.com).

<a href="https://discord.gg/faxes" target="_blank">
    <img alt="Discord Invite" src="https://api.weblutions.com/discord/invite/faxes/light">
</a>