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

## Create bot instance

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

## Get bot user

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
In this section we will look at how to get updates using long pulling. 
This method is easies for testing since it does not require you to have a public domain or IP with HTTPS support,
more on getting updates via webhook [here](/content/docs/helpers/updates-webhook.md)
