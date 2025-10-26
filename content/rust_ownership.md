+++
title = "Rust Ownership"
date = 2020-12-20
[taxonomies]
tags = ["rust", "ownership"]
categories = ["rust"]
+++

<!-- cSpell:ignore sbrk, malloc -->

Program execution requires persistent storage of intermediate results to support sequential instruction execution.
This stateful memory must be carefully managed across concurrent program executions, a task traditionally handled by operating systems through system calls (e.g., `brk`/`sbrk`).
Programming languages provide abstractions over these mechanisms to enable safer memory management strategies.

<!--more-->

#### Memory Management Paradigms

1. **Programmer-Managed (e.g., C)**:
   The programmer explicitly allocates and deallocates memory via functions like `malloc` and `free`.
   This approach grants fine-grained control but introduces risks such as **use-after-free** (accessing freed memory) and **double frees** (freed memory reclaimed twice).
   These issues can cause undefined behavior or security vulnerabilities.

1. **Runtime-Managed (e.g., Python)**:
   Runtimes maintain memory through reference counting: when a variable references memory, the count increments; when the variable goes out of scope, the count decrements.
   Memory is freed when the count reaches zero.
   Cycle detection (references mutually holding each other) requires **stop-the-world pauses** during garbage collection, resulting in performance overhead.
   Such pauses can cause latency spikes in production systems.

1. **Compiler-Enforced (e.g., Rust)**:
   Rust leverages compile-time analysis to manage memory safely without runtime overhead.
   This approach eliminates common pitfalls through **ownership semantics**, which define strict rules for memory lifetime and borrowing.

#### Ownership: Core Mechanism

Rust's ownership model is designed to solve the limitations of runtime-based memory management by ensuring **compile-time safety** through predictable memory lifetimes.
Unlike reference counting systems, ownership:

- **Explicitly governs memory lifetimes**:
  Each memory region has a single owner.
  When the owner goes out of scope, the memory is automatically deallocated.
- **Enforces transfer semantics**:
  Ownership transfers via *move* operations, ensuring memory is reclaimed only when the new owner goes out of scope.
- **Prevents invalid references**:
  Borrowing mechanisms (read-only v/s mutable) ensure references are always valid at compile time.

#### Borrowing: Safe Sharing

Borrowing allows temporary sharing of owned memory without transferring ownership.
The compiler enforces:

- **Read-only borrows** (immutable references):
  Multiple borrows are permitted.
- **Write borrows** (mutable references):
  Only one borrow is allowed at a time.
  This prevents re-entrancy issues and ensures data consistency.

This design guarantees that:

1. All borrowers access valid memory
1. Mutability conflicts are resolved at compile time
1. No data races occur without explicit unsafe code

#### Why Ownership Works

Ownership resolves the "reference tracking problem" by restricting runtime outcomes to a finite set of scenarios.
By requiring explicit ownership transfers and borrow checks at compile time, Rust eliminates classically unsafe patterns (e.g., dangling pointers, data races) without runtime overhead.
This enables high-performance applications with guaranteed memory safety.
