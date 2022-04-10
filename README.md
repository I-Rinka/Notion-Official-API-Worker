# Notion Official API Worker

A serverless solution for the **OFFICIAL** Notion API.

Since notion offcial sdk is still in beta version, it does not provide APIs that support CORS (Cross-origin resource sharing) that enables using notion as a serverless CMS. Therefore, I create this repository. This software is a fork version of [cors-anywhere](https://github.com/Rob--W/cors-anywhere).

**Adding Cloudflare worker support....**

## Usage

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

example:

```bash

curl https://localhost:8081/https://api.notion.com/v1/databases/6c12515ae1d64423839e4540cacf49a5

```

Notice: Since you use your own intergration key, you should add the requested page to your integration.

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
