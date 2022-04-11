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
    authorization: "Bearer ",
    "Notion-Version": "2022-02-22",
  }, // Set these request headers.
  corsMaxAge: 0, // If set, an Access-Control-Max-Age header with this value (in seconds) will be added.
  // helpFile: __dirname + "/help.txt",
};

function checkRequiredHeadersPresent(request) {
  // Throws exception on verification failure.
  // if (!request.headers.get('Origin') && !request.headers.get('x-requested-with')) {
  // 	throw new BadRequestException('Missing required request header. Must specify one of: origin,x-requested-with');
  // }
}

function UnauthorizedException(reason) {
  this.status = 401;
  this.statusText = "Unauthorized";
  this.reason = reason;
}

function BadRequestException(reason) {
  this.status = 400;
  this.statusText = "Bad Request";
  this.reason = reason;
}

function isListed(uri, listing) {
  let returnValue = false;
  console.log(uri);
  if (typeof uri === "string") {
    for (const m of listing) {
      if (uri.match(m) !== null) {
        returnValue = true;
      }
    }
  } else {
    //   Decide what to do when Origin is null
    returnValue = true; // True accepts null origins false rejects them.
  }

  return returnValue;
}

function fix(myHeaders, request, isOPTIONS) {
  myHeaders.set("Access-Control-Allow-Origin", "*");
  if (isOPTIONS) {
    myHeaders.set(
      "Access-Control-Allow-Methods",
      request.headers.get("access-control-request-method")
    );
    const acrh = request.headers.get("access-control-request-headers");

    if (acrh) {
      myHeaders.set("Access-Control-Allow-Headers", acrh);
    }

    myHeaders.delete("X-Content-Type-Options");
  }

  return myHeaders;
}

async function proxyRequest(request) {
  const isOPTIONS = request.method === "OPTIONS";
  const originUrl = new URL(request.url);

  const location = request.url.replace(originUrl.origin, "").slice(1);
  const fetchUrl = new URL(location);

  // how to set cors headers? -> add response headers

  // Throws if it fails the check
  checkRequiredHeadersPresent(request);

  // Excluding urls which are not allowed as destination urls
  // Exclude origins which are not int he included ones
  // if (isListed(fetchUrl.toString(), [...exclude, ...(activeApiKey?.exclude || [])]) || !isListed(origin, [...include, ...(activeApiKey?.include || [])])) {
  // 	throw new BadRequestException('Origin or Destination URL is not allowed.');
  // }

  let corsHeaders = request.headers.get("x-cors-headers");

  if (corsHeaders !== null) {
    try {
      corsHeaders = JSON.parse(corsHeaders);
    } catch {}
  }

  if (!originUrl.pathname.startsWith("/")) {
    throw new BadRequestException('Pathname does not start with "/"');
  }

  const recvHpaireaders = {};
  Object.keys(corsAnywhere.setHeaders).forEach(function(header) {
    recvHpaireaders[header] = corsAnywhere.setHeaders[header];
  });

  const newRequest = new Request(request, {
    headers: recvHpaireaders,
  });

  console.log("fetch", fetchUrl.hostname);
  const response = await fetch(fetchUrl, newRequest);
  console.log("code:", response.status);
  const newCorsHeaders = [];
  const allh = {};
  for (const pair of response.headers.entries()) {
    newCorsHeaders.push(pair[0]);
    allh[pair[0]] = pair[1];
  }

  const body = isOPTIONS ? null : await response.arrayBuffer();
  newCorsHeaders.push("cors-received-headers");

  let res = new Response(body, {
    status: isOPTIONS ? 200 : response.status,
    statusText: isOPTIONS ? "OK" : response.statusText,
  });
  fix(res.headers, request, isOPTIONS);
  res.headers.set("Access-Control-Expose-Headers", newCorsHeaders.join(","));

  return res;
}

async function handleRequest(request) {
  return proxyRequest(request);
}

addEventListener("fetch", async (event) => {
  event.respondWith(
    handleRequest(event.request).catch((error) => {
      const message = error.reason || error.stack || "Unknown Error";

      return new Response(message, {
        status: error.status || 500,
        statusText: error.statusText || null,
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          // Disables caching by default.
          "Cache-Control": "no-store",
          // Returns the "Content-Length" header for HTTP HEAD requests.
          "Content-Length": message.length,
        },
      });
    })
  );
});
