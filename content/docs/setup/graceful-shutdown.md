---
title: "Graceful Shutdown"
description: "Graceful shutdown for your bot."
lead: "Graceful shutdown for your bot."
date: 2022-05-07T23:17:27+03:00
lastmod: 2022-05-07T23:17:27+03:00
draft: false
images: []
menu:
docs:
parent: "setup"
weight: 152
toc: true
---

## Basic example

It is good practice to have a graceful shutdown for bot in order to complete all running tasks.

Most common way to implement it is to use `signal.Notify` function. First, import required packages.

```go
import (
    "os"
    "os/signal"
    "syscall"
)
```

Initialize signal handling and done chan.

```go
sigs := make(chan os.Signal, 1)
signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

done := make(chan struct{}, 1)
```

> Note: List of signals to listen for can be extended to your needs, some info about
> signals [here](https://man7.org/linux/man-pages/man7/signal.7.html).

Handle stop signal (e.g. Ctrl+C) and stop any running tasks.

```go
go func () {
// Wait for stop signal
<-sigs

// Stop any tasks here ...

// Notify that stop is done
done <- struct{}{}
}()
```

Wait for the stop process to be completed.

```go
// Wait for done signal
<-done

// Exit program
```

{{<details "Full Code Example">}}

```go
package main

import (
    "fmt"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/mymmrac/telego"
)

func main() {
    botToken := os.Getenv("TOKEN")

    bot, err := telego.NewBot(botToken, telego.WithDefaultDebugLogger())
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }

    sigs := make(chan os.Signal, 1)
    signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

    done := make(chan struct{}, 1)

    updates, _ := bot.UpdatesViaLongPulling(nil)

    for update := range updates {
        fmt.Println("Processing update:", update.UpdateID)
        time.Sleep(time.Second * 5) // Simulate long process time
        fmt.Println("Done update:", update.UpdateID)
    }

    go func() {
        <-sigs

        fmt.Println("Stopping...")

        bot.StopLongPulling()
        fmt.Println("Long pulling done")

        done <- struct{}{}
    }()

    <-done
    fmt.Println("Done")
}
```

{{</details>}}

Code with all comments also available on
GitHub [here](https://github.com/mymmrac/telego/blob/main/examples/graceful_shutdown_no_helpers/main.go).

## Long pulling example

Basically the same as first example, but we need to start handler in goroutine and also call `bh.Stop` inside stop
handler.

{{<details "Full Code Example">}}

```go
package main

import (
    "fmt"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/mymmrac/telego"
    th "github.com/mymmrac/telego/telegohandler"
)

func main() {
    botToken := os.Getenv("TOKEN")

    bot, err := telego.NewBot(botToken, telego.WithDefaultDebugLogger())
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }

    sigs := make(chan os.Signal, 1)
    signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

    done := make(chan struct{}, 1)

    updates, _ := bot.UpdatesViaLongPulling(nil)

    bh, _ := th.NewBotHandler(bot, updates, th.WithStopTimeout(time.Second*10))

    bh.Handle(func(bot *telego.Bot, update telego.Update) {
        fmt.Println("Processing update:", update.UpdateID)
        time.Sleep(time.Second * 5) // Simulate long process time
        fmt.Println("Done update:", update.UpdateID)
    })

    go func() {
        <-sigs

        fmt.Println("Stopping...")

        bot.StopLongPulling()
        fmt.Println("Long pulling done")

        bh.Stop()
        fmt.Println("Bot handler done")

        done <- struct{}{}
    }()

    go bh.Start()
    fmt.Println("Handling updates...")

    <-done
    fmt.Println("Done")
}
```

{{</details>}}

Code with all comments also available on
GitHub [here](https://github.com/mymmrac/telego/blob/main/examples/graceful_shutdown_long_pulling/main.go).

## Webhook example

Again, pretty similar to the first and second example, but added start for webhook (no need to use goroutine as it is
a non-blocking function) and also stop of webhook before stopping bot handler.

{{<details "Full Code Example">}}

```go
package main

import (
    "fmt"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/mymmrac/telego"
    th "github.com/mymmrac/telego/telegohandler"
)

func main() {
    botToken := os.Getenv("TOKEN")

    bot, err := telego.NewBot(botToken, telego.WithDefaultDebugLogger())
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }

    sigs := make(chan os.Signal, 1)
    signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

    done := make(chan struct{}, 1)

    updates, _ := bot.UpdatesViaWebhook("/bot" + bot.Token())

    bh, _ := th.NewBotHandler(bot, updates, th.WithStopTimeout(time.Second*10))

    // Handle updates
    bh.Handle(func(bot *telego.Bot, update telego.Update) {
        fmt.Println("Processing update:", update.UpdateID)
        time.Sleep(time.Second * 5) // Simulate long process time
        fmt.Println("Done update:", update.UpdateID)
    })

    go func() {
        <-sigs

        fmt.Println("Stopping...")

        _ = bot.StopWebhook()
        fmt.Println("Webhook done")

        bh.Stop()
        fmt.Println("Bot handler done")

        done <- struct{}{}
    }()

    go bh.Start()
    fmt.Println("Handling updates...")

    _ = bot.StartListeningForWebhook("localhost:443")

    <-done
    fmt.Println("Done")
}
```

{{</details>}}

Code with all comments also available on
GitHub [here](https://github.com/mymmrac/telego/blob/main/examples/graceful_shutdown_webhook/main.go).
