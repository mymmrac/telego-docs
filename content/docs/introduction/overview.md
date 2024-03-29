---
title: "Overview"
description: "Overview of capabilities and general structure."
lead: "Overview of capabilities and general structure."
date: 2022-02-13T10:11:02+02:00
draft: false
images: [ ]
menu:
docs:
parent: "introduction"
weight: 101
toc: true
---

## What is Telego?

This library was designed to be the one-to-one implementation of Telegram Bot API, with all methods and types
represented in Go code.
It's also, easy-to-use and understand, because of the same naming and types as described
in [Telegram API](https://core.telegram.org/bots/api) with as small as possible differences.
Telego provides almost all comments and descriptions in [godoc](https://pkg.go.dev/github.com/mymmrac/telego).

Since using bare methods and types is not so convenient, Telego gives you a lot
of [helpers](/content/docs/helpers/updates-long-polling.md),
[utilities](/content/docs/utilities/utilities-basics.md),
and even [update handlers](/content/docs/handlers/handlers-basics.md) with
[predicates](/content/docs/handlers/predicates.md).

## What can it do?

Basically, anything that Telegram provides for developers of bots and much more with wide configuration capabilities,
utilities and helpers.
It's even added to the official [Telegram code examples](https://core.telegram.org/bots/samples#go) page.

### Quick Start

{{< alert icon="⚡️" text="For a quick start on your new Telegram bot." />}}

[Quick Start](/content/docs/introduction/quick-start.md) for fast and easy development.

### Tutorial

{{< alert icon="🪁" text="For a more descriptive and full tutorial of Telego." />}}

[Tutorial](/content/docs/introduction/tutorial.md) for full-features overview.

### Short explanation

If you want to quickly create your first bot and don't want to know the full capabilities of Telego, visit
[Quick Start](/content/docs/introduction/quick-start.md).

If you want to know more, you can go to [Tutorial](/content/docs/introduction/tutorial.md) and read about different
parts of Telego and how you can combine them.
An in-depth explanation of different "levels" and concepts that Telego may be informally divided is described in
[Low Level](/content/docs/levels/low-level.md), [Medium Level](/content/docs/levels/medium-level.md), and
[High Level](/content/docs/levels/high-level.md) respectfully.

Fill free to build your own abstractions around Telego to fulfill your needs if plain Telego isn't enough for you.

{{< alert icon="⚠️" text="Telego is still in an unstable version, so not everything may work as expected." />}}

## How one-to-one implementation achieved?

Managing this number of abilities that Telegram bots provide is quite hard, so Telego parts that represent API are
generated from [docs](https://core.telegram.org/bots/api) itself.
Every method and type with respectful documentation is obtained from documentation and restructured in Go code which
we can use.
If you are interested in how it actually works and how Telego is really easy to maintain up to date,
visit generator implementation [here](https://github.com/mymmrac/telego/tree/main/internal/generator).
