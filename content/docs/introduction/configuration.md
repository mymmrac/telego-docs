---
title: "Configuration"
description: "Configuration that Telego provides when creating bot."
lead: "Configuration that Telego provides when creating bot."
date: 2022-05-07T23:17:27+03:00
lastmod: 2022-05-07T23:17:27+03:00
draft: false
images: []
menu:
docs:
parent: "introduction"
weight: 104
toc: true
---

## What can be configured?

Telego does not provide a large set of things that can be configured, but still you can set some low-level things
starting from the bot API server and ending with your own API caller.

There are two ways to configure your setup:

- Bot options
- [Long pulling](/content/docs/helpers/updates-long-pulling.md) / [Webhook](/content/docs/helpers/updates-webhook.md)
  helper options

### Bot options

These are options that can be passed as optional arguments to `telego.NewBot`  after bot token.

- `WithAPIServer`
    - Change bot API server URL (reason why to do
      so [here](https://core.telegram.org/bots/api#using-a-local-bot-api-server))
    - Default: `https://api.telegram.org`
- `WithLogger`
    - Create you custom logger that implements `telego.Logger`
    - Default: Telego has build in default logger
    - **Note**: Please keep in mind that logger may expose sensitive information, use in development only or configure
      it not to leak unwanted content
- `WithDefaultLogger`
    - Configuration of default logger, enable printing debug information and errors
    - Default: `false` for debug, `true` for errors
- `WithDefaultDebugLogger`
    - Default logger with enabled debug logs
- `WithExtendedDefaultLogger`
    - Same as `WithDefaultLogger`, but allows you to specify `strings.Replacer` that will replace any string in logs
    - Default: if used default logger will replace bot token into `BOT_TOKEN`
- `WithDiscardLogger`
    - Disable any logs
- `WithHealthCheck`
    - Run [`getMe`](https://core.telegram.org/bots/api#getme) method on bot creation for health check.
- `WithWarnings`
    - Treat any warnings as errors (e.g. deleting already deleted webhook)
- `WithFastHTTPClient`
    - By default, Telego uses [`valyala/fasthttp`](https://github.com/valyala/fasthttp) and you can specify your own
      client that will be to make requests
    - Default: `&fasthttp.Client{}`
- `WithEmptyValues`
    - Used in combination with `telego.Bot.EmptyValue()` to get empty values for string parameters in cases where
      empty parameter is a valid value
    - Default: no empty value is set, so using `telego.Bot.EmptyValue()` does nothing
    - When enabled: `telego.Bot.EmptyValue()` returns `TELEGO_EMPTY_VALUE` which will be erased from request
- `WithCustomEmptyValues`
    - Same as `WithEmptyValues`, but you can set "empty value" to any string
- `WithAPICaller`
    - In case if you think that [`valyala/fasthttp`](https://github.com/valyala/fasthttp) doesn't feet you use-case as
      API "caller", then you can provide your own implementation of `telegoapi.Caller`
    - Default: `telegoapi.FasthttpAPICaller`
- `WithRequestConstructor`
    - You can also provide your own way of "constructing" requests for both regular (JSON) and multipart (key-value &
      files) requests
    - Default: `telegoapi.DefaultConstructor`

> Note: Some options override the same values as others, so it is important to use only one option from "group" of
> options (e.g. all options related to logger will override each other).

[//]: # (TODO: Add alert here)
