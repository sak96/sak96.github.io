+++
title = "Python Coroutine"
date = 2023-03-08
[taxonomies]
tags = ["python", "coroutine "]
categories = ["python"]
+++

Consider the problem of maintaining a running sum of integers, which we will refer to as the `Summer` problem (a nod to the season).
We will demonstrate how co-routines work by trying to implement running sum.

<!--more-->

### Traditional Class-Based Solution

The simplest approach uses a class with explicit `add` and `sum` methods to maintain a running total:

```python
class Summer:
    def __init__(self, total=0):
        self.total = total
    def add(self, m=0):
        self.total += m
    def sum(self):
        return self.total

summer = Summer()
summer.add(10)
assert summer.sum() == 10
```

### Callable-Objects Based Solution

To reduce object complexity, we can implement `__call__` method that both updates the sum and returns the current value.

```python
class SummerV0:
    def __init__(self, total=0):
        self.total = total
    def __call__(self, m=0):
        self.total += m
        return self.total

summer = SummerV0()
assert summer(10) == 10
assert summer() == 10
```

### Co-Routines with Global State Based Solution

A coroutine implementation can be written using global state for maintaining the running sum:

```python
def summer_v1(total_init=0):
    global total
    total = total_init
    while True:
        z = yield
        total += z if z else 0

summer = summer_v1()
next(summer)
summer.send(10)
assert total == 10
```

### Stateful Co-Routines Based Solution

A coroutine implementation can store state in local variable as well:

```python
def summer_v2(total=0):
    total = total
    while True:
        z = yield total
        total += z if z else 0

summer = summer_v2()
summer_again = summer_v2(12)
assert next(summer) == 0
assert next(summer_again) == 12
assert summer.send(10) == 10
assert summer_again.send(10) == 22
```

### Automated Initialization Pattern

Co-routines require explicit initialization with `.send(None)` or `next`.
Otherwise it raise Exception `TypeError: can't send non-None value to a just-started coroutine`.
This can be avoided using decorators as follows:

```python
def safety_wrapper(cr):
    """the safety wrapper"""
    def init_cr(*args, **kwargs):
        dec_cr = cr(*args, **kwargs)
        dec_cr.send(None)
        return dec_cr
    return init_cr

@safety_wrapper
def summer_v3(total_init=0):
    total = total_init
    while True:
        z = yield total
        total += z if z else 0

summer = summer_v3()
assert summer.send(10) == 10
```

### Advance Co-routine Handling

Coroutine has advanced feature other than [send](https://docs.python.org/3/reference/datamodel.html#coroutine.send) like:

- [close](https://docs.python.org/3/reference/datamodel.html#coroutine.close):
  Terminates the coroutine execution, causing subsequent `send` operations to raise `StopIteration` exceptions.
  This ensures the coroutine enters a finalized state.
  Specialized action like clean-up can be take by handling `Generation Exit` Exception.

- [throw](https://docs.python.org/3/reference/datamodel.html#coroutine.throw):
  Enables the propagation of exceptions within the coroutine context.
  This feature can be leverage to specialized action.

```python
class Reset(Exception):
    pass

@safety_wrapper
def summer_v4(total_init=0):
    total = total_init
    while True:
        try:
            z = yield total
            total += z if z else 0
        except Reset:
            total = 0
        except GeneratorExit:
            print(f"total={total}")
            return

summer = summer_v4()
assert summer.send(10) == 10
summer.close()  # prints `total=10`

exception = False
try:
    summer.send(11)
except StopIteration:
    exception = True

assert exception

summer_1 = summer_v4()
assert summer_1.send(10) == 10
assert summer_1.send(10) == 20
assert summer_1.throw(Reset) == 0
assert summer_1.send(10) == 10
```
