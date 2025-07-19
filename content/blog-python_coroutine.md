+++
title = "python coroutine"
date = 2023-03-08
[taxonomies]
tags = ["python", "coroutine "]
categories = ["python"]
+++
## Easy problem and Typical solution

Imagine a problem where you need to keep track of sum of integer.
Let us call it problem of `Summer` (also a season).
Typical solution to the problem is to store sum in object.
We will move from this solution towards one which demonstrate working of coroutine.

The typical solution will involve object which takes integer as input.
It stores the sum as state and provides the output.

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

## Let's call some objects

Instead of having two different methods, a single method can used.
The said method can update the sum with input and return the sum as output.
The default value of `0` as input to this will emulate `sum` from previous example.

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

Object can be called as function by implementing `__call__` function.
This allow calling the object like any other function in python.
Calling the object will call the `__call__` method with the argument specified.

## Summer using coroutine and globals

In previous example we used a single state which is updated when the object is called.
This could also be achieved by using coroutine with similar interface.

Coroutine looks similar to function in python but the differ in certain ways.
They can store state and `yield` the output instead of `return`-ing the output.
In this regard they are closer to generator rather than function.

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

In the above example you see that we are using `global` variable to access the state.
The coroutine returns a coroutine, this is initialized by calling `next` on the same.
The initialization of coroutine will run the code till first yield.
Once initialized the coroutine, input can be sent by using [send][send] interface.
The value enters the coroutine at `yield` and can be used by the coroutine as it see fit.

## No global please!!!

In previous example globals was used to access the state.
This would mean having two coroutine would not be possible at same time.
The problem can be avoided if coroutine could return the value of the state.
The `yield` can be followed by value that can be returned by `send` interface.

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

## Automatic Initialization of coroutine

The initialization of coroutine from coroutine is needed before sending values.
Sending value before initialization will raise exception.
The message will be `TypeError: can't send non-None value to a just-started coroutine`.
To avoid such accident we can decorate the coroutine with a `safety_wrapper`.

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

Note in the example we are not using `next` instead we are using `obj.send(None)`.
Using `next` is actually calling `obj.send(None)` internally.


## How to stop or rest summer for summing up.

Coroutine can be [closed][close] just like a generator which has been exhausted.
Coroutine can be auto closed when it goes out of scope.
Clean up action can be taken when coroutine by catching `GeneratorExit` exception.

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

The coroutine is suppose `return` on `GeneratorExit` marking end of generator.
If the coroutine `return` then `RuntimeError: generator ignored GeneratorExit` is raised.
On `return` the coroutine has ended hence it will throw `StopIteration` if `send` is called.

The coroutine also has a method [throw][throw] which can be used to throw exception.
This interface is used throw `Reset` exception which reset the state to `0`.

[close]: https://docs.python.org/3/reference/datamodel.html#coroutine.close
[throw]: https://docs.python.org/3/reference/datamodel.html#coroutine.throw
[send]: https://docs.python.org/3/reference/datamodel.html#coroutine.send

