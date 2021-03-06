---
title: "Quick Start"
description: "Quick start with basics of creation of Telegram Bot."
lead: "Quick start with basics of creation of Telegram Bot."
date: 2022-02-13T10:11:08+02:00
lastmod: 2022-02-13T10:11:08+02:00
draft: false
images: []
menu:
  docs:
    parent: "introduction"
weight: 102
toc: true
---

## Where to start?

If you are a complete beginner and/or have no experience with Telegram Bots or don't know where to start, highly
suggest first reading [Bots: An introduction for developers](https://core.telegram.org/bots)  in order to understand
what bots can do. If you have questions about how to create/modify a bot or what is a bot token, that is also described
in
the introduction for developers.

If you are familiar with bots capabilities, but still don't know how they work, you can read at least some parts of
[API reference](https://core.telegram.org/bots/api):

- [Authorizing your bot](https://core.telegram.org/bots/api#authorizing-your-bot)
- [Making requests](https://core.telegram.org/bots/api#making-requests)
- [Getting updates](https://core.telegram.org/bots/api#getting-updates)

## Starting with Telego

For a quick start, you can follow these simple steps and at the end you will have a simple "echo" bot that sends your
messages back to you. From that you can go further exploring Telegram bots.

{{< alert icon="⚠️" text="Error handling may be missing, but I strongly recommend handling all errors." />}}

Get Telego with `go get`.

```shell
go get -u github.com/mymmrac/telego
```

Import Telego packages. More about [handlers](/docs/handlers/handlers-basics) and
[utils](/docs/utilities/utilities-basics).

```go
import (
    "fmt"
    "os"

    "github.com/mymmrac/telego"
    th "github.com/mymmrac/telego/telegohandler"
    tu "github.com/mymmrac/telego/telegoutil"
)
```

Create a bot instance and specify optional settings. More about [configuration](/docs/introduction/configuration)
options.

```go
botToken := os.Getenv("TOKEN")

bot, err := telego.NewBot(botToken, telego.WithDefaultLogger(true, true))
if err != nil {
    fmt.Println(err)
    os.Exit(1)
}
```

> It's not recommended to hardcode tokens, so environment variable
> was used. Also, both error and debug logs were enabled.

Get and print bot info. More about [methods](/docs/methods/methods-basics).

```go
botUser, err := bot.GetMe()
if err != nil {
    fmt.Println(err)
    os.Exit(1)
}

fmt.Printf("Bot user: %+v\n", botUser)
```

> If everything was properly configured you should see your bot user printed.

Get updates from Telegram via long pulling (not recommend, more [here](/docs/helpers/updates-long-pulling)).

```go
updates, _ := bot.UpdatesViaLongPulling(nil)
defer bot.StopLongPulling()
```

Create bot handler, register new message handler and start handling updates. More about
[methods](docs/methods/methods-basics) and [handlers](/docs/handlers/handlers-basics).

```go
bh := th.NewBotHandler(bot, updates)

bh.HandleMessage(func(bot *telego.Bot, message telego.Message) {
    chatID := tu.ID(message.Chat.ID)
    _, _ = bot.CopyMessage(
        tu.CopyMessage(chatID, chatID, message.MessageID),
    )
})

bh.Start()
defer bh.Stop()
```

Now you are done, after starting your bot you will see debug logs of updates that came to the bot and any sent messages
to the bot will be sent back to you.

## Next steps

For more information keep reading next sections of docs, in [tutorial](/docs/introduction/tutorial) the same example
will be reviewed more closely with different ways to do things.

Most of the things you will need to know can be found in [Telegram Bot API](https://core.telegram.org/bots/api) and/or
in these docs, so just keep exploring.

You can also look at some other examples located [here](https://github.com/mymmrac/telego/tree/main/examples).
