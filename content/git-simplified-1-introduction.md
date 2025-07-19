+++
title = "git simplified 1 introduction"
date = 2020-04-29
draft = true
[taxonomies]
tags = ["version", "git", "information"]
categories = ["vcs"]
+++
## Articles

This article is part of series which provides introduction to git internals.

1. [Git: Introduction]({filename}./2020-04-29_git-simplified-1-introduction.md)

## Introduction

Git is the stupid `content tracker` (as per it's [man page][git man page]).
As a content tracker it tracks the modification of done to content.
It acts like a diary for how/when/where content got modified.

This help to enabled the following:

- Track Ownership of changes.
- Backup and Restore to certain older point.
- Synchronization changes between multiple contents.

Git keeps track of the whole system as **Directed Acyclic Graph of Hashes of commits**.
Each hash represents a commit or state of content at given time.
Lets dig bit deeper about the graph part.

## Directed Acyclic Graph

```txt
+-------+       +-------+       +-------+
| grand |------>|parent |------>| child |
| parent|       |       |       |       |
+-------+       +-------+       +-------+
```



_Graph_ is structure which represents relation between objects using connection.

- The object in this case is _commits_.
- The relationship in this case is _parent-child_ relationship.
- There relation can be many to many.
- Multiple child can share single parent.
- Single child may be created by Multiple parents.

_Directed_ refers to the fact that these relationships have a direction.

- The direction in this case is from child to parent.
- The arrow head points to the direction.

_Acyclic_ means the graph does not have cycles or loops.

- More information at [wiki][wiki dag].

## Hash

The Directed Acyclic Graph is made of Hashes.
Hash function map variable size input to fixed size output.
Here each content has different size, you hash them you to get fixed sized output.
The fixed sized output is the hash of the input.

Cryptographic Hashes are hash which are hard to reverse.
You cannot guess input from getting output of the hash.
In case of git _sha-1_ is used for hashing.
In recent version _sha-256_ is used as per [hash function transition article][hashes]).

## Commit

The snapshot of content at any point of time is called commit.
Even though content refers to folder level of content.
The changes are maintained at file level.
So the commit contains details of these changes.
More about commit will be covered in next chapter.

## Resources

1. Git: [Stupid Content Tracker][git man page].
1. [Tech Talk: Linus Torvalds on git][torvalds on git]
1. [wiki: Directed acyclic graph][wiki dag]
1. [Hash Function Transition][hashes]

[//]: # "resource links"
[git man page]: https://linux.die.net/man/1/git "git man page"
[torvalds on git]: https://www.youtube.com/watch?v=4XpnKHJAok8 "Torvalds on git"
[wiki dag]: https://en.wikipedia.org/wiki/Directed_acyclic_graph "Wikipedia: DAG"
[hashes]: https://git-scm.com/docs/hash-function-transition/2.18.0 "Hashes"

