---
title: "Commands"
description: "Doks comes with commands for common tasks."
lead: "Doks comes with commands for common tasks."
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  docs:
    parent: "prologue"
weight: 130
toc: true
---

{{< alert icon="💡" text="You can change the commands in the scripts section of `./package.json`." />}}

## create

Create new content for your site:

```bash
npm run create [path] [flags]
```

See also the Hugo docs: [hugo new](https://gohugo.io/commands/hugo_new/).

## Go test

Go code test

```go
package main

import (
	"fmt"
	"os"

	"github.com/mymmrac/telego"
)

func main() {
	// Get Bot token from environment variables
	botToken := os.Getenv("TOKEN")

	// Create bot and enable debugging info
	// (more on configuration at /examples/configuration/main.go)
	bot, err := telego.NewBot(botToken, telego.DefaultLogger(true, true))
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// Call method getMe (https://core.telegram.org/bots/api#getme)
	botUser, err := bot.GetMe()
	if err != nil {
		fmt.Println("Error:", err)
	}

	// Print Bot information
	fmt.Printf("Bot user: %#v\n", botUser)
}
```

## lint

Check scripts, styles, and markdown for errors:

```bash
npm run lint
```

### scripts

Check scripts for errors:

```bash
npm run lint:scripts [-- --fix]
```

### styles

Check styles for errors:

```bash
npm run lint:styles [-- --fix]
```

### markdown

Check markdown for errors:

```bash
npm run lint:markdown [-- --fix]
```

## clean

Delete temporary directories:

```bash
npm run clean
```

## start

Start local development server:

```bash
npm run start
```

## build

Build production website:

```bash
npm run build
```

### functions

Build Lambda functions:

```bash
npm run build:functions
```

### preview

Build production website including draft and future content:

```bash
npm run build:preview
```
