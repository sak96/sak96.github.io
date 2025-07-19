+++
title = "rust ownership"
date = 2020-12-20
draft = true
[taxonomies]
tags = ["rust", "ownership"]
categories = ["rust"]
+++
<!-- cSpell:ignore sbrk, malloc -->

This article explains my understanding of rust ownership concepts.
Article will only give simplistic overview and might not hold water in all cases.

## Memory Management

Program (or Software) is set of instruction, followed by machine to solve some problem.
Some instruction may be based on output of instruction executed in the past.
So the program needs to store output instruction for use by later instructions.
The storage is called memory (or state) of program.

But typical machines run more than one program simultaneously or interleaving-ly.
So memory needs to be managed between programs.
This herculean task is undertaken by the operating system through system calls (brk/sbrk).

Programing Language provide abstraction over these memory management calls (sbrk/brk).
Few Approach are briefed below.

### Programmer Specified

> Example: C

Programer uses **malloc** to ask for memory and **free** to free the memory.
These function are abstraction on top of brk/sbrk system calls.
This provides greater control which comes with possibility making mistakes.

If you free memory when it is in use, it is called **use after free**.
If you free memory when it is in already freed it is called **double free**.
These things can cause program to behave weirdly (could be exploited).

### Runtime Assisted

> Example: Python

Program is run on top of a runtime which manages memory on behalf of the program.

The most common way is keep **count of references** to memory.
When variable reference a memory it count is incremented.
When this variable is no longer in use the memory count is decremented.
When reference count goes to zero that means no one is referencing the memory.
This means memory can be freed.

But there is issue of **cycle** that is two references referencing each other.
Which means that there reference count is never going back to zero.
To resolve this, runtime regularly check for such references by stopping the program.
The program is stopped to avoid updating of reference count during the check.
These are the infamous **Stop the World** pauses.

This means runtime add negatively to performance.
Any improvement to performance will require understanding of runtime.
Most common issues is variable accidentally holding to data which is no longer required
(_closures_ which hold references large data, which is kept but never going to executed).

### Compiler Assisted

> Example: Rust

Compiler analyses the code and inserts memory management code at appropriate position.

The most common way is to do a **life time analysis** of variable.
Compiler checks for usage of variable (usually the reference) in code.
If the variable is not used after certain point compiler inserts _free_ logic there.

One way to implement this is by creating a copy of variable on each reference.
This way the chain of reference is linear and can be dropped once variable is dropped.
But this may lead to large memory consumptions.
One of the other ways is Rust ownership model.

## Ownership

### Why Ownership?

_Life time analysis_ requires to determine all runtime reference at compile time.
This is hard problem as you need to analysis all possible runtime outcomes.

Having protocol to allow programmer to restrict unwanted outcomes can help the analysis.
This restricts number of runtime outcomes and hence reduces compiler's work.
This protocol is the rust ownership model.

### What is Ownership?

Ownership is a concept where a memory is linked to a owner (variable).
This allows compiler to free the memory when owner is no longer in use.
When a owner is no longer in use we call it is **out of scope**.
In short, Ownership is assigning memory's life time to life time of it's owner.

This concept seems simple but is very constraining for programmers.
To provide flexibility concepts like **move** and **borrow** are used.

### What is Move?

Move is concept of transferring ownership of memory from one owner to other owner.
This means the memory is not freed when the _previous_ owner goes _out of scope_.
But the memory is freed when the _new_ owner goes _out of scope_.

### What is Borrow?

Most cases in program we may want to share the memory between two variable.
This means we may want to have _two owner_ for a memory.
This makes it confusing for the compiler about when to free the memory.

Instead variable are allowed to share by **borrowing** memory from the owner.
This means there is only one owner for a given memory.
The compiler still frees the memory when owner goes out of scope.
If borrower has access to memory after owner goes out of scope compiler throws error.
This makes sure all borrower have access to valid memory in compiled program.

Compiler treats borrow differently based on whether it is read only or write.
In _read only (immutable)_ borrow case there can be multiple borrowers for a memory.
But for _write (mutable)_ borrow only single borrower is allowed.
This means write borrow also disallows read only borrow and vice versa.

Reasoning for _single mutable borrow_ is for safety in case of complex data structures.
Say for a vector write may free internal memory pointed by other borrower.
This leads to the other borrower using freed memory.
Once the mutable borrower goes out of scope the memory is available for re-sharing.

