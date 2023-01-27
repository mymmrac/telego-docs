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
parent: "setup"
weight: 151
toc: true
---

## Configuration and default values

Telego does not provide a large set of things that can be configured, but still you can set some low-level things
starting from the bot API server and ending with your own API caller.

By design, default values that are used when no options are provided,
considered to be a good starting point, but if you want to get most out of Telego it is strongly recommended to check
what can be configured and decide for your current project what is the best.

There are three main ways to configure your setup:

- Bot options
- [Long polling](/content/docs/helpers/updates-long-polling.md) / [Webhook](/content/docs/helpers/updates-webhook.md)
  helper options
- [Bot handler](/content/docs/handlers/handlers-basics.md) options

{{< alert icon="⚠️" text="Order of options is important." />}}

Some options override the same values as others, so it is important to use only one option from "group" of options (e.g.
all options related to logger will override each other).

### Bot options

These are options that can be passed as optional arguments to `telego.NewBot`  after bot token.

Most useful of them are: `WithHealthCheck`, `WithLogger`, `WithAPIServer`, `WithEmptyValues`.

Full list of Bot options:

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
- `WithHTTPClient`
  - Alternative to a fasthttp client you can use a client from `net/http`
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

### Long polling options

These are options that can be passed as optional arguments to `telego.Bot.UpdatesViaLongPolling` after `getUpdates`
parameters.

List of options:

- `WithLongPollingUpdateInterval`
    - Update interval for long polling, ensure that between two calls of `telego.Bot.GetUpdates` will be at least
      specified time, but it could be longer
    - Default: 0s
    - **Note**: Telegram has built in a timeout mechanism, to properly use it, set `telego.GetUpdatesParams.Timeout` to
      desired timeout and update interval to 0 (default, recommended way)
- `WithLongPollingRetryTimeout`
    - Interval before trying to get updates after an error
    - Default: 8s
- `WithLongPollingBuffer`
    - Buffer size of update chan that will be returned
    - Default: 100

> If `telego.GetUpdatesParams` passed into `bot.UpdatesViaLongPolling` as nil, then default timeout of 8s will be
> applied, unless explicitly specified using non-nil parameter

### Webhook options

These are options that can be passed as optional arguments to `telego.Bot.UpdatesViaWebhook` after `getUpdates`
parameters.

List of options:

- `WithWebhookServer`
    - FastHTTP server to use for webhook listening
    - Default: `&fasthttp.Server{}`
- `WithWebhookRouter`
    - FastHTTP router to use with webhook (from [`fasthttp/router`](https://github.com/fasthttp/router))
    - Default: `router.New()`
    - **Note**: For webhook to work properly POST route with a path specified in `telego.Bot.UpdatesViaWebhook` must be
      unset
- `WithWebhookBuffer`
    - Buffer size of update chan that will be returned
    - Default: 100
- `WithWebhookHealthAPI`
    - Basic health API on GET `/health` path of the router
    - Default: disabled

### Bot handler options

These are options that can be passed as optional arguments to `th.NewBotHandler` after bot and updates chan.

List of options:

- `WithStopTimeout`
    - Wait for updates to be processed for specified time
    - Default: 0s (stop immediately)
