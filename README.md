# Notion Official API Worker

A serverless solution for the **OFFICIAL** Notion API.

Since notion offcial sdk is still in beta version, it does not provide APIs that support CORS (Cross-origin resource sharing) that enables using notion as a serverless CMS. Therefore, I create this repository. This software is a fork version of [cors-anywhere](https://github.com/Rob--W/cors-anywhere).

**Adding Cloudflare worker support....**

## Usage

example:

```bash

curl https://notion-api.rinka-notion.workers.dev/https://api.notion.com/v1/databases/6c12515ae1d64423839e4540cacf49a5  

```

1. Create `.env` at the root of this repository.

```bash
touch .env
```

2. Add your notion developer key.

This file will be loaded by `dotenv` as the configuration of our proxy, which should contains your Notion intergration key and the Notion API Version.

```txt
NOTION_KEY="secret_..."
NOTION_VERSION="2022-02-22"
```

3. Deploy and start the server.

```bash
node ./server.js
```

Notice: You should deploy the worker by yourself.

4. Request the Data!

You can use `curl` or `@notionhq` official API to get the data.

Usage: `https://proxyhost` `/` `https://api.notion.com/v1/` `request`


Notice: Since you use your own intergration key, you should add the requested page to your integration.

## For Cloudflare

Inside `./index.js`, set authorization to your notion key. Then publish it to cloudflare worker.

```javascript
const corsAnywhere = {
    handleInitialRequest: null, // Function that may handle the request instead, by returning a truthy value.
    // getProxyForUrl: getProxyForUrl, // Function that specifies the proxy to use
    maxRedirects: 5, // Maximum number of redirects to be followed.
    originBlacklist: [], // Requests from these origins will be blocked.
    originWhitelist: [], // If non-empty, requests not from an origin in this list will be blocked.
    checkRateLimit: null, // Function that may enforce a rate-limit by returning a non-empty string.
    redirectSameOrigin: false, // Redirect the client to the requested URL for same-origin requests.
    requireHeader: null, // Require a header to be set?
    removeHeaders: [], // Strip these request headers.
    setHeaders: {
    authorization:'Bearer secret_',
    'Notion-Version':'2022-02-22'
    }, // Set these request headers.
    corsMaxAge: 0, // If set, an Access-Control-Max-Age header with this value (in seconds) will be added.
    // helpFile: __dirname + "/help.txt",
};

```

## License

Copyright (C) 2013 - 2021 Rob Wu <rob@robwu.nl>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
