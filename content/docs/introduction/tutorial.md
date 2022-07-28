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
    updates, err := bot.GetUpdates(&telego.GetUpdatesParams{
        Offset: offset,
        Timeout: 5,
    })
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

Since now, you should know how to get updates, it's time to use some Telegram methods to make your bot interactive.
Let's just send your message back to you, essentially make an echo bot.
Telego provides one-to-one representation of all the methods Telegram provides with respectful parameters.

```go
bh.HandleMessage(func(bot *telego.Bot, message telego.Message) {
    chatID := message.Chat.ID
    sentMessage, err := bot.SendMessage(&SendMessageParams{
        ChatID: telego.ChatID{ID: chatID},
        Text:   message.Text,
    })
    // ...
})
```

Here we took chat ID of the message that came from the user and sent a message with the same text back to the same chat.

> Telegram provides two ways to specify chat ID: as chat ID (`int64`) or as username (`string`),
> so Telego provides specific type for that -`telego.ChatID` which has `ID` and `Username` fields that are mutually
> exclusive.

Since we are build echo bot,
sending only text messages isn't sufficient
(if you will send an image, for example, this will not work since our new message only contains text),
so we can send a copy of the message:

```go
// Handle updates ...
chatID := telego.ChatID(ID: message.Chat.ID)
sentMessageID, err := bot.CopyMessage(&telego.CopyMessageParams{
    ChatID:     chatID,
    FromChatID: chatID,
    MessageID:  message.MessageID,
})
```

> In this case `CopyMessage` will send back any message, it does not matter if its text, photo or voice message.

### Using Telego utils

Some common methods like sending messages, answering callback queries or
[other](/content/docs/utilities/utilities-basics.md) have utility methods
that will help you easily call methods with all required parameters set by arguments.
To use them, import `telegoutil` package with alias `tu` for cleaner code:

```go
import tu "github.com/mymmrac/telego/telegoutil"
```

For creating chat IDs, there are two methods:

```go
chatID := tu.ID(1234567)
// Or
chatID := tu.Username("@telegram")
```

For sending messages, you can use:

```go
_, err := bot.SendMessage(tu.Message(tu.ID(1234567), "Hello Telego!"))
// Or to copy message
chatID := tu.ID(message.Chat.ID)
_, err := bot.CopyMessage(tu.CopyMessage(chatID, chatID, message.MessageID))
```

There are many more utils to use, see [here](/content/docs/utilities/utilities-basics.md).

### Using `With...` methods

Let's try to send inline keyboard using utility methods:

```go
_, err := bot.SendMessage(&telego.SendMessageParams{
    ChatID: tu.ID(1234567),
    Text: "Awesome Keyboard",
    ReplyMarkup: tu.InlineKeyboard(
        tu.InlineKeyboardRow(
            telego.InlineKeyboardButton{ 
                Text: "Callback",
                CallbackData: "data",
            },
            telego.InlineKeyboardButton{
                Text: "URL",
                URL: "https://example.com",
            },
        ),
        tu.InlineKeyboardRow(
            telego.InlineKeyboardButton{
                Text: "Switch to Inline",
                SwitchInlineQueryCurrentChat: "telego",
            },
        ),
    ),
})
```

> Here `telego.InlineKeyboardButton` has one required parameter (`text`) and exactly on of optional parameters should
> be set, callback data, URL, etc.

As you can see using only Telego utils, you can do everything,
but it's still not ideal solution;
that's why you can try to use `With...` methods in combination with utils,
they allow you to modify parameters without creating explicit variables or using struct literals:

```go
// ...
ReplyMarkup: tu.InlineKeyboard(
    tu.InlineKeyboardRow(
        tu.InlineKeyboardButton("Callback").WithCallbackData("data"),
        tu.InlineKeyboardButton("URL").WithURL("https://example.com"),
    ),
    tu.InlineKeyboardRow(
        tu.InlineKeyboardButton("Switch to Inline").
            WithSwitchInlineQueryCurrentChat("telego"),
    ),
),
// ...
```

You can also chain `With...` methods to fill more than one parameter,
more on them [here](/content/docs/helpers/with-like-methods.md).

## Conclusions & next steps

This tutorial should give you a general overview of Telego features and what you can do with bots,
some links for more investigation and knowledge of what can be used.
I highly recommend reading [levels](/content/docs/levels/_index.md) section of the docs
to understand how you can utilize Telego features and capabilities and
[configuration](/content/docs/introduction/configuration.md)
to get the idea what you can modify and change for your needs.
Reading about [updates via webhook](/content/docs/helpers/updates-webhook.md) will also be useful for production ready
bots.

Explore all other features of Telego and enjoy building your bots.
