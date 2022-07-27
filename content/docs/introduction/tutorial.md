---
title: "Tutorial"
description: "Descriptive tutorial with all aspects of Telego, good place to start."
lead: "Descriptive tutorial with all aspects of Telego, good place to start."
date: 2022-02-13T10:11:13+02:00
lastmod: 2022-02-13T10:11:13+02:00
draft: false
images: []
menu:
docs:
parent: "introduction"
weight: 103
toc: true
---

## Introduction

In this tutorial, you will see different parts of a library used to create a simple "echo"
bot with more in depth explanation and different ways to do the same thing.

You will create bot, set different settings, call Telegram to get bot user, start getting updates with specified
parameters, use helper method to get updates, handle updates in simple loop, create new bot handler, use general purpose
handlers, use message handler, call Telegram method to send message, use Telego utils to simplify methods usage and
use `With...` methods.

{{< alert icon="⚠️" text="Error handling may be missing, but I strongly recommend handling all errors." />}}

For more examples, visit examples folder in GitHub repo [here](https://github.com/mymmrac/telego/tree/main/examples).

## Setup

Get Telego with `go get`.

```shell
go get -u github.com/mymmrac/telego
```

Import `telego` and `os` (for getting bot token
from [environment variables](https://en.wikipedia.org/wiki/Environment_variable), hard coding access tokens is highly
insecure).

```go
import (
    "fmt"
    "os"

    "github.com/mymmrac/telego"
)
```

### Create bot instance

Get bot token and create new bots from it, also handle errors.

```go
botToken := os.Getenv("TOKEN")

bot, err := telego.NewBot(botToken)
if err != nil {
    fmt.Println(err)
    os.Exit(1)
}
```

For this tutorial, let's enable debug logs by adding bot options.
More about [configuration](/content/docs/introduction/configuration.md).

```go
bot, err := telego.NewBot(botToken, telego.WithDefaultDebugLogger())
```

> Here `WithDefaultDebugLogger` is an option for default logger with `debugMode` and `printErrors` set to true.

### Get bot user

Call Telegram API to get bot user ([getMe method](https://core.telegram.org/bots/api#getme)) and print its info, also
handle error.
More about [methods](/content/docs/methods/methods-basics.md).

```go
botUser, err := bot.GetMe()
if err != nil {
    fmt.Println(err)
    os.Exit(1)
}

fmt.Printf("Bot user: %+v\n", botUser)
```

> Good practice to check bot info before starting the main bot functionality.
> This works as a kind of healthcheck (see [configuration](/content/docs/introduction/configuration.md) for more).

## Getting updates

Telegram provides two ways to get updates: long pulling and webhook.
In this section we will look at how to get updates using [long pulling](/content/docs/helpers/updates-long-pulling.md).
This method is easies for testing since it does not require you to have a public domain or IP with HTTPS support,
more on getting updates via webhook [here](/content/docs/helpers/updates-webhook.md).

Telegram exposes method for getting updates - `getUpdates`which doesn't have any required parameters,
but you still can provide some (like last update's `offset` or `timeout`).
Single call will return "unhandled" updates
(read more about that on [description of `offset`](https://core.telegram.org/bots/api#getupdates) field).

```go
// Returns []telego.Update
updates, err := bot.GetUpdates(&telego.GetUpdatesParams{ Offset: 0 })
```

This will get you a slice of current updates, but to get new updates you should constantly request them with new offset:

```go
offset := 0
for {
    updates, err := bot.GetUpdates(&telego.GetUpdatesParams{ Offset: offset, Timeout: 5 })
    // Handle error ...
    
    offset = updates[len(updates) - 1].UpdateID + 1
}
```

> Here we are setting `offset` to last update ID + 1, to get next one.

### Getting updates with helper

Since it is really common to get updates, Telego provides helper for that.
It will call `GetUpdates` method in infinite loop and send all received updates into read only chanel,
also it will handle updating offset to proper one and retries in case of failures for you.

```go
// Returns <-chan telego.Update
updates, err := bot.UpdatesViaLongPulling(nil)
```

To stop getting updates, you should call stop method:

```go
bot.StopLongPulling()
```

> More on getting updates via long pulling with helper [here](/content/docs/helpers/updates-long-pulling.md).

## Processing updates

To process updates, you can simply get them one by one in for loop:

```go
for update := range updates {
    fmt.Printf("Update: %+v\n", update)
    // Handle update ...
}
```

### Bot handlers

For simple bots, this might work perfectly,
but with more completed one you will soon realize that it's not very convenient.
That's why Telego has [Bot Handlers](/content/docs/handlers/handlers-basics.md).

```go
import th "github.com/mymmrac/telego/telegohandler"
```

> For convenience, we use `th` as an import alias for `telegohandler`.

Create bot handler:

```go
// You are still getting updates via chanel
bh, err := th.NewBotHandler(bot, updates)

// ...

// Stop at the end ...
bh.Stop()
```

Bot handlers work like HTTP handlers, but instead of paths, they use predicates on updates.
It's a general purpose handler for any update that matches predicates:

```go
bh.Handle(func(bot *telego.Bot, update telego.Update) {
    fmt.Printf("Update: %+v\n", update)
    // Handle update ...
}, th.AnyMessage())
```

> Here `th.AnyMessage()` is a predicate that will match on any update with message.
> More on predicates [here](/content/docs/handlers/predicates.md).

### Specific bot handlers

Often you want to handle updates with only messages or callback queries, etc.
General purpose handlers are suitable for this, but there is a better way todo so.

You can register handler for specific updates, for example, to handle only messages:

```go
bh.HandleMessage(func(bot *telego.Bot, message telego.Message) {
    fmt.Printf("Message: %+v\n", message)
    // Handle message ...
})
```

> In this case `bh.HandleMessage` will match any update with non `nil` message.
> More on specific handlers [here](/content/docs/handlers/specific-handlers.md).

## Using Telegram methods

...
