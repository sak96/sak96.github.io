+++
title = "Git Introduction"
date = 2020-04-29
[taxonomies]
tags = ["version", "git", "information"]
categories = ["vcs"]
+++
Git is a “content tracker” – it records how files change over time. Think of it as a detailed history of your project, noting when, where, and by whom changes were made. This enables key features like:

- Tracking who owns specific changes.
- Backing up and reverting to older versions.
- Synchronizing changes across multiple locations.

<!--more-->

Git’s underlying structure is a **Directed Acyclic Graph (DAG) of Hashes**.
Each “hash” represents a specific version (or “commit”) of your content.

### Understanding the Directed Acyclic Graph (DAG)

A DAG shows the relationships between different versions of your content.
It’s like a family tree for your files:

```txt
+-------+       +-------+       +-------+
| grand |------>|parent |------>| child |
| parent|       |       |       |       |
+-------+       +-------+       +-------+
```

- **Directed:** Changes flow from a version to its parent.
- **Acyclic:** There are no loops – a version doesn’t directly influence itself.

### Hashes and Cryptographic Security

The DAG is built using “hashes”.
A hash function takes any size input and produces a fixed-size output.
In Git, each piece of content is hashed, creating a unique fingerprint.
Cryptographic hashes, like SHA-1 (used in older versions) and SHA-256, are particularly important because they are designed to be extremely difficult to reverse – meaning you can’t figure out the original content just from its hash.

### Commits: Snapshots of Content

A “commit” is a snapshot of your content at a specific point in time. Even though Git tracks changes at a file level, the commit itself records all the details of those alterations. We’ll delve deeper into commits in the next section.

## Resources

1. Git: [Stupid Content Tracker][git man page].
1. [Tech Talk: Linus Torvalds on git][torvalds on git]
1. [wiki: Directed acyclic graph][wiki dag]
1. [Hash Function Transition][hashes]

[git man page]: https://linux.die.net/man/1/git "git man page"
[hashes]: https://git-scm.com/docs/hash-function-transition/2.18.0 "Hashes"
[torvalds on git]: https://www.youtube.com/watch?v=4XpnKHJAok8 "Torvalds on git"
[wiki dag]: https://en.wikipedia.org/wiki/Directed_acyclic_graph "Wikipedia: DAG"
