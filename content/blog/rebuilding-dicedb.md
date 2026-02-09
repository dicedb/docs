---
title: Why (Re)Building DiceDB And What's Next
description: A behind-the-scenes look at why DiceDB exists, the technical decisions shaping it, and how it is evolving to support reactive, AI-driven, and modern state-heavy applications.
author: Arpit Bhayani
date: 2026-02-09
---

DiceDB is an [open source](https://github.com/dicedb/dicedb), in-memory database built on top of [Valkey](http://valkey.io/). It focuses on supporting modern application workloads while remaining fully compatible with the Valkey and Redis ecosystem.

This blog is where we will share design decisions, performance work, architectural trade-offs, and the realities of building and operating a new database in public.

# Why DiceDB Exists

## Workloads Are Changing

Application architectures today look very different from the
request-response services that shaped most existing data systems.

Modern systems increasingly need to support:

* Real-time user experiences driven by live state changes
* AI-driven features that maintain evolving conversational or reasoning state
* Background agents coordinating multi-step workflows

These workloads introduce new state patterns that are
not always cleanly handled by traditional data access models.

AI and agent workflows, for example, frequently require:

* Short-lived working memory that evolves rapidly
* Small Context graphs that link user actions, tool results, and reasoning chains
* Ephemeral storage layers that should exist for minutes or hours, not days
* Reactive state propagation where downstream components automatically respond to state changes

Today, these are implemented using multiple infrastructure layers,
including message queues, custom caches, vector stores, orchestration engines,
and application-managed state coordination. While flexible, this increases
operational complexity and introduces failure boundaries across layers.

DiceDB exists because we believe some of these patterns can be handled
closer to the data layer while preserving the simplicity that
made Redis and Valkey successful.

# The First Attempt

## Building a Storage Engine From Scratch

DiceDB originally started as a [Golang-based storage engine](https://github.com/dicedb/dice-legacy).
The goal was to explore higher throughput designs and introduce
reactive data interaction models where applications subscribe to
query results instead of polling for changes.

The early experiments validated several ideas around reactive
result sets and efficient state updates. However, building a
production-grade storage engine introduced challenges that are
difficult to shortcut.

Databases earn trust slowly. Features like:

* Replication correctness
* Durability guarantees
* Failure recovery
* Operational stability across edge cases

take years of real-world exposure to harden properly.

Continuing down that path would have meant delaying practical
value for users who were already interested in the higher-level
capabilities DiceDB was exploring.

The [legacy implementation](https://github.com/dicedb/dice-legacy) is now
archived, but many of its ideas continue to influence the current direction of the project.

More importantly, that effort would not have been possible without
the [contributors who invested their time and ideas](https://github.com/dicedb/dice-legacy/graphs/contributors). Open source projects are shaped by curiosity and volunteer
energy, and the early DiceDB community helped define the technical direction
of the project. We remain deeply grateful for that foundation.

# Why We Built on Valkey

Valkey provides a mature and battle-tested core with:

* Proven replication and persistence models
* Predictable operational characteristics
* A large ecosystem of tooling and clients

Rebuilding these guarantees from scratch would not only
duplicate effort but would also fragment compatibility with
an ecosystem developers already trust.

By building DiceDB on top of Valkey, we can focus on extending
functionality rather than re-solving foundational database
problems. It also means teams can adopt DiceDB without rewriting
clients, retraining operators, or changing deployment models.

Just as importantly, building on Valkey is also a way of
contributing back to a growing open source database ecosystem
that prioritizes openness and long-term sustainability.

# What DiceDB Adds

DiceDB is focused on extending Valkey in ways that help applications
manage larger working datasets and evolving state interaction patterns.

## Memory Extension Through Spill

One of the first capabilities we introduced
is the [spill module](https://github.com/dicedb/dicedb-spill).

Traditional in-memory systems require applications to
carefully manage eviction strategies or introduce secondary
storage systems. The spill module transparently persists evicted
keys to disk and restores them on access.

This enables:

* Larger effective working datasets under fixed memory budgets
* Reduced application complexity around cache layering
* More predictable performance when dataset sizes fluctuate

The goal is not to replace durable databases but to reduce the
friction between memory-speed access and cost-efficient storage.

This is not a new or unheard-of feature, as many caches offer disk
persistence, but it paves the way for DiceDB to reach where it
aims to go. Hence, we start with this.

## Reactivity and Query Subscription

In the coming weeks, we will be porting Reactivity and Query Subscription
from our legacy implementation to DiceDB. The key idea is:

Instead of forcing applications to continuously poll for state
changes, allow result sets to automatically update subscribers
when the underlying data changes.

Reactive patterns can simplify:

* Real-time dashboards and streaming UI updates
* Agent coordination across shared state
* Event-driven pipeline orchestration
* Collaborative systems that depend on consistent shared views of state

These capabilities aim to reduce the need for separate event
buses or synchronization layers for certain classes of workloads.

## Other Areas

AI-driven applications introduce new categories of state
that sit somewhere between caching and durable storage.

DiceDB is exploring primitives that better support:

- Ephemeral Memory Layers
- Context Graph Storage
- Out of the box State Coordination Across Agents

These areas are still evolving and will be shaped heavily by real-world usage and community feedback.

# Give It A Spin

DiceDB is production-ready for workloads that benefit from Valkey
compatibility while needing extended memory and reactive capabilities.

Since DiceDB builds directly on top of Valkey, existing clients,
SDKs, and operational tooling work out of the box. Teams can evaluate
or adopt DiceDB without restructuring their infrastructure stack.

You can [get started](/docs/installation/docker) in under a minute.

As the project evolves, stability remains a priority. New
capabilities will be introduced progressively and with careful validation.

# What To Expect From This Blog

This space will document both successes and trade-offs. Expect to see:

* Internal implementation details
* Data structure and memory layout decisions
* Performance optimization strategies
* Feature Deep Dives

# Keep An Eye On This Space

DiceDB is still early. Some ideas will work exactly as
expected. Others will need to evolve or be replaced entirely. That
is the nature of building infrastructure in public.

Our goal is to move carefully, share transparently, and
build something genuinely useful for developers working
with modern state-heavy systems.
