# Java Streams and Lambdas

## Overview
This guide explores Java's functional programming capabilities through lambdas, streams, and functional interfaces. Introduced in Java 8, these features enable more concise, expressive code and facilitate parallel data processing. Streams provide a functional approach to processing collections of objects, while lambdas allow you to write inline, anonymous functions.

## Prerequisites
- Solid understanding of Java core concepts
- Experience with Java collections
- Familiarity with object-oriented programming
- Basic understanding of method references

## Learning Objectives
- Understand lambda expressions and their syntax
- Master functional interfaces in the java.util.function package
- Apply method references for more concise code
- Create and utilize Stream pipelines for data processing
- Transform data collections using map, filter, and reduce operations
- Apply terminal operations to produce results from streams
- Leverage parallel streams for improved performance
- Understand optional values and their proper usage
- Combine multiple functional operations for complex data transformations
- Recognize appropriate use cases for functional vs imperative approaches

## Table of Contents
1. [Lambda Expressions](#lambda-expressions)
2. [Functional Interfaces](#functional-interfaces)
3. [Method References](#method-references)
4. [Introduction to Streams](#introduction-to-streams)
5. [Intermediate Operations](#intermediate-operations)
6. [Terminal Operations](#terminal-operations)
7. [Optional Class](#optional-class)
8. [Parallel Streams](#parallel-streams)
9. [Best Practices](#best-practices)
10. [Common Pitfalls](#common-pitfalls)

## Lambda Expressions

### Lambda Syntax
Lambda expressions provide a concise way to express instances of single-method interfaces (functional interfaces).

Basic syntax: `(parameters) -> expression` or `(parameters) -> { statements; }`

```java
// Lambda with no parameters
Runnable runnable = () -> System.out.println("Hello, World!");

// Lambda with one parameter (type inferred)
Consumer<String> consumer = message -> System.out.println(message);

// Lambda with multiple parameters
Comparator<String> comparator = (s1, s2) -> s1.length() - s2.length();

// Lambda with explicit parameter types
BiFunction<Integer, Integer, Integer> add = (Integer a, Integer b) -> a + b;

// Multi-line lambda with block
Consumer<String> printer = message -> {
    String formattedMessage = "Message: " + message;
    System.out.println(formattedMessage);
};
```

### Variable Capture
Lambdas can access variables from the surrounding scope:

```java
String prefix = "User: ";

// Lambda capturing the prefix variable
Consumer<String> printUser = name -> System.out.println(prefix + name);

// Using the lambda
printUser.accept("John"); // Outputs: User: John
```

Variables used in lambda expressions must be effectively final (not changed after initialization).

```java
int count = 0;

// Incorrect: trying to modify a captured variable
Runnable runnable = () -> {
    count++; // Compile error: Variable used in lambda should be final or effectively final
};

// Correct: using AtomicInteger for mutable counter
AtomicInteger atomicCount = new AtomicInteger(0);
Runnable correctRunnable = () -> {
    atomicCount.incrementAndGet(); // Works fine
};
```

### Lambda vs Anonymous Classes
Lambdas are more concise than anonymous inner classes:

```java
// Anonymous class approach
Runnable anonymousRunnable = new Runnable() {
    @Override
    public void run() {
        System.out.println("Anonymous class");
    }
};

// Lambda approach
Runnable lambdaRunnable = () -> System.out.println("Lambda expression");
```

Key differences:
- `this` refers to the enclosing instance in a lambda, but to the anonymous class instance in an anonymous class
- Lambdas don't introduce a new scope for variables
- Lambdas are more memory-efficient

## Functional Interfaces

### Core Functional Interfaces
Java 8 introduced several predefined functional interfaces in the `java.util.function` package:

#### Function<T, R>
Represents a function that takes one argument and produces a result.

```java
Function<String, Integer> stringLength = s -> s.length();
Integer length = stringLength.apply("Hello"); // returns 5

// Function composition
Function<Integer, Integer> multiply = n -> n * 2;
Function<Integer, Integer> add = n -> n + 3;

Function<Integer, Integer> multiplyThenAdd = multiply.andThen(add);
Integer result1 = multiplyThenAdd.apply(5); // (5 * 2) + 3 = 13

Function<Integer, Integer> addThenMultiply = multiply.compose(add);
Integer result2 = addThenMultiply.apply(5); // (5 + 3) * 2 = 16
```

#### Predicate<T>
Represents a function that takes one argument and returns a boolean.

```java
Predicate<String> isEmpty = s -> s.isEmpty();
boolean result = isEmpty.test(""); // returns true

// Predicate composition
Predicate<String> isNotEmpty = isEmpty.negate();
Predicate<String> isLong = s -> s.length() > 10;
Predicate<String> isLongAndNotEmpty = isNotEmpty.and(isLong);

boolean test1 = isLongAndNotEmpty.test("Hello World!"); // true
boolean test2 = isLongAndNotEmpty.test(""); // false
boolean test3 = isLongAndNotEmpty.test("Hello"); // false

Predicate<String> isShortOrEmpty = isLong.negate().or(isEmpty);
```

#### Consumer<T>
Represents an operation that takes one argument and returns no result.

```java
Consumer<String> print = s -> System.out.println(s);
print.accept("Hello"); // prints "Hello"

// Consumer chaining
Consumer<String> log = s -> System.out.println("Log: " + s);
Consumer<String> printThenLog = print.andThen(log);
printThenLog.accept("Hello");
// Prints:
// Hello
// Log: Hello
```

#### Supplier<T>
Represents a supplier of results, takes no input but returns a value.

```java
Supplier<Double> randomValue = () -> Math.random();
Double value = randomValue.get(); // returns a random double

Supplier<List<String>> listSupplier = () -> new ArrayList<>();
List<String> newList = listSupplier.get(); // returns a new empty ArrayList
```

#### BiFunction<T, U, R>
Takes two arguments and produces a result.

```java
BiFunction<String, String, String> concat = (a, b) -> a + b;
String result = concat.apply("Hello, ", "World!"); // "Hello, World!"

BiFunction<Integer, Integer, Integer> multiply = (a, b) -> a * b;
Integer product = multiply.apply(5, 7); // 35
```

### Specialized Functional Interfaces
Java provides specialized interfaces for primitive types to avoid boxing/unboxing:

```java
// For int operations
IntPredicate isEven = n -> n % 2 == 0;
boolean check = isEven.test(4); // true

IntFunction<String> intToString = n -> String.valueOf(n);
String str = intToString.apply(123); // "123"

IntConsumer printInt = n -> System.out.println(n);
printInt.accept(42); // prints 42

IntSupplier randomInt = () -> new Random().nextInt(100);
int value = randomInt.getAsInt(); // random int between 0-99

IntUnaryOperator square = n -> n * n;
int squared = square.applyAsInt(5); // 25

IntBinaryOperator sum = (a, b) -> a + b;
int total = sum.applyAsInt(10, 20); // 30

// Similar interfaces exist for long and double:
// LongPredicate, LongFunction, LongConsumer, etc.
// DoublePredicate, DoubleFunction, DoubleConsumer, etc.
```

### Creating Custom Functional Interfaces
You can define your own functional interfaces:

```java
@FunctionalInterface
public interface TriFunction<T, U, V, R> {
    R apply(T t, U u, V v);
}

// Using custom functional interface
TriFunction<Integer, Integer, Integer, Integer> sum3 = 
    (a, b, c) -> a + b + c;
Integer result = sum3.apply(1, 2, 3); // 6
```

The `@FunctionalInterface` annotation enforces that the interface has exactly one abstract method.

## Method References

Method references provide a shorthand notation for lambdas that simply call an existing method.

### Types of Method References

#### 1. Reference to a static method: `ClassName::staticMethod`
```java
// Instead of: Function<String, Integer> parser = s -> Integer.parseInt(s);
Function<String, Integer> parser = Integer::parseInt;

Integer value = parser.apply("123"); // 123
```

#### 2. Reference to an instance method of a particular object: `instance::instanceMethod`
```java
String greeting = "Hello";
// Instead of: Supplier<String> supplier = () -> greeting.toUpperCase();
Supplier<String> supplier = greeting::toUpperCase;

String result = supplier.get(); // "HELLO"
```

#### 3. Reference to an instance method of an arbitrary object of a particular type: `ClassName::instanceMethod`
```java
// Instead of: Function<String, Integer> lengthFunc = s -> s.length();
Function<String, Integer> lengthFunc = String::length;

Integer length = lengthFunc.apply("Hello"); // 5

// Instead of: BiPredicate<String, String> contains = (s, substr) -> s.contains(substr);
BiPredicate<String, String> contains = String::contains;

boolean result = contains.test("Hello World", "World"); // true
```

#### 4. Reference to a constructor: `ClassName::new`
```java
// Instead of: Supplier<List<String>> listSupplier = () -> new ArrayList<>();
Supplier<List<String>> listSupplier = ArrayList::new;

List<String> list = listSupplier.get(); // new ArrayList

// With a parameter
// Instead of: Function<Integer, List<String>> sizedListCreator = n -> new ArrayList<>(n);
Function<Integer, List<String>> sizedListCreator = ArrayList::new;

List<String> sizedList = sizedListCreator.apply(10); // ArrayList with initial capacity 10
```

## Introduction to Streams

### What is a Stream?
A stream is a sequence of elements that supports sequential and parallel aggregate operations. It is not a data structure but a view of the data from a source like collections, arrays, or I/O channels.

```java
// Creating streams from different sources
List<String> names = Arrays.asList("John", "Jane", "Adam", "Eve");

// From a collection
Stream<String> streamFromCollection = names.stream();

// From an array
String[] namesArray = {"John", "Jane", "Adam", "Eve"};
Stream<String> streamFromArray = Arrays.stream(namesArray);

// From individual values
Stream<String> streamOfValues = Stream.of("John", "Jane", "Adam", "Eve");

// Empty stream
Stream<String> emptyStream = Stream.empty();

// Infinite streams
Stream<Integer> infiniteIntegers = Stream.iterate(0, n -> n + 1);
Stream<Double> infiniteRandoms = Stream.generate(Math::random);
```

### Stream Pipeline
A stream pipeline consists of:
1. A source
2. Zero or more intermediate operations
3. A terminal operation

```java
List<String> names = Arrays.asList("John", "Jane", "Adam", "Eve");

long count = names.stream()    // Source
                .filter(s -> s.startsWith("J"))  // Intermediate operation
                .map(String::toUpperCase)        // Intermediate operation
                .count();                        // Terminal operation

System.out.println("Count: " + count); // 2
```

### Stream Characteristics
- **Laziness**: Intermediate operations are lazy and only executed when a terminal operation is invoked
- **Once-use**: A stream can only be used once
- **Non-interference**: Data sources should not be modified during stream operations
- **Stateless behavior**: For best performance, operations should not depend on any state outside the operation

```java
Stream<String> stream = names.stream();
stream.forEach(System.out::println);
// stream.count(); // Throws IllegalStateException: stream has already been operated upon or closed
```

## Intermediate Operations

Intermediate operations transform a stream into another stream and are lazy (not executed until a terminal operation is invoked).

### Filtering Operations

#### filter
Filters elements based on a predicate.

```java
List<String> names = Arrays.asList("John", "Jane", "Adam", "Eve", "Alice");

List<String> filteredNames = names.stream()
    .filter(name -> name.length() > 3)
    .collect(Collectors.toList());
// filteredNames: [John, Jane, Adam, Alice]
```

#### distinct
Returns a stream with distinct elements.

```java
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 3, 3, 4, 5, 5);

List<Integer> distinctNumbers = numbers.stream()
    .distinct()
    .collect(Collectors.toList());
// distinctNumbers: [1, 2, 3, 4, 5]
```

#### limit
Limits the stream to a specified size.

```java
List<Integer> first3Numbers = numbers.stream()
    .limit(3)
    .collect(Collectors.toList());
// first3Numbers: [1, 2, 2]
```

#### skip
Skips the first n elements.

```java
List<Integer> skipFirst2 = numbers.stream()
    .skip(2)
    .collect(Collectors.toList());
// skipFirst2: [2, 3, 3, 3, 4, 5, 5]
```

### Transformation Operations

#### map
Transforms each element using a function.

```java
List<String> names = Arrays.asList("John", "Jane", "Adam");

List<Integer> nameLengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());
// nameLengths: [4, 4, 4]

List<String> upperCaseNames = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// upperCaseNames: [JOHN, JANE, ADAM]
```

#### mapToInt, mapToLong, mapToDouble
Maps to primitive streams.

```java
List<String> names = Arrays.asList("John", "Jane", "Adam");

// Using mapToInt to avoid boxing
int totalLength = names.stream()
    .mapToInt(String::length)
    .sum();
// totalLength: 12
```

#### flatMap
Flattens nested streams into a single stream.

```java
List<List<Integer>> nestedLists = Arrays.asList(
    Arrays.asList(1, 2, 3),
    Arrays.asList(4, 5, 6),
    Arrays.asList(7, 8, 9)
);

List<Integer> flattenedList = nestedLists.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList());
// flattenedList: [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Another example with strings
List<String> words = Arrays.asList("Hello", "World");

List<String> letters = words.stream()
    .flatMap(word -> Arrays.stream(word.split("")))
    .collect(Collectors.toList());
// letters: [H, e, l, l, o, W, o, r, l, d]
```

### Ordering Operations

#### sorted
Sorts the elements of the stream.

```java
List<String> names = Arrays.asList("John", "Jane", "Adam", "Eve");

// Natural order
List<String> sortedNames = names.stream()
    .sorted()
    .collect(Collectors.toList());
// sortedNames: [Adam, Eve, Jane, John]

// Custom order
List<String> sortedByLength = names.stream()
    .sorted(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()))
    .collect(Collectors.toList());
// sortedByLength: [Eve, Adam, Jane, John]
```

#### peek
Allows operations to be performed on elements as they flow through a stream, mainly for debugging.

```java
List<String> result = names.stream()
    .filter(name -> name.length() > 3)
    .peek(name -> System.out.println("Filtered: " + name))
    .map(String::toUpperCase)
    .peek(name -> System.out.println("Mapped: " + name))
    .collect(Collectors.toList());

// Output:
// Filtered: John
// Mapped: JOHN
// Filtered: Jane
// Mapped: JANE
// Filtered: Adam
// Mapped: ADAM
```

## Terminal Operations

Terminal operations produce a result or side effect and cause the Stream pipeline to be executed.

### Reduction Operations

#### reduce
Combines elements into a single result.

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// Sum using reduce
int sum = numbers.stream()
    .reduce(0, (a, b) -> a + b);
// or
int sum2 = numbers.stream()
    .reduce(0, Integer::sum);
// sum and sum2: 15

// Finding maximum
Optional<Integer> max = numbers.stream()
    .reduce(Integer::max);
// max.get(): 5

// Concatenating strings
String concatenated = Stream.of("a", "b", "c")
    .reduce("", (a, b) -> a + b);
// concatenated: "abc"

// More complex reduction
int sumOfSquares = numbers.stream()
    .reduce(0, (sum, num) -> sum + num * num, Integer::sum);
// sumOfSquares: 55 (1 + 4 + 9 + 16 + 25)
```

### Collection Operations

#### collect
Gathers elements into a collection or other data structure.

```java
List<String> names = Arrays.asList("John", "Jane", "Adam", "Eve");

// Collecting to different collections
List<String> namesList = names.stream()
    .collect(Collectors.toList());

Set<String> namesSet = names.stream()
    .collect(Collectors.toSet());

// Joining elements
String joined = names.stream()
    .collect(Collectors.joining(", "));
// joined: "John, Jane, Adam, Eve"

// Grouping
Map<Integer, List<String>> groupedByLength = names.stream()
    .collect(Collectors.groupingBy(String::length));
// groupedByLength: {3=[Eve], 4=[John, Jane, Adam]}

// Partitioning
Map<Boolean, List<String>> partitioned = names.stream()
    .collect(Collectors.partitioningBy(name -> name.startsWith("J")));
// partitioned: {false=[Adam, Eve], true=[John, Jane]}

// Statistics for numeric streams
IntSummaryStatistics stats = names.stream()
    .collect(Collectors.summarizingInt(String::length));
// stats.getAverage(), stats.getSum(), stats.getMin(), stats.getMax(), stats.getCount()

// Custom collector for calculating average length
Double averageLength = names.stream()
    .collect(Collectors.averagingInt(String::length));
// averageLength: 3.75
```

### Iteration and Search Operations

#### forEach
Performs an action on each element.

```java
names.stream()
    .forEach(System.out::println);

// For parallel streams, forEachOrdered preserves the encounter order
names.parallelStream()
    .forEachOrdered(System.out::println);
```

#### findFirst, findAny
Find the first element or any element that matches.

```java
Optional<String> first = names.stream()
    .findFirst();
// first.get(): "John"

Optional<String> any = names.stream()
    .findAny();
// any.get(): could be any element, but typically "John" for sequential streams

// Finding first element that matches a condition
Optional<String> firstWithJ = names.stream()
    .filter(name -> name.startsWith("J"))
    .findFirst();
// firstWithJ.get(): "John"
```

#### anyMatch, allMatch, noneMatch
Check if any, all, or no elements match a predicate.

```java
boolean hasJ = names.stream()
    .anyMatch(name -> name.startsWith("J"));
// hasJ: true

boolean allShort = names.stream()
    .allMatch(name -> name.length() < 5);
// allShort: true

boolean noZ = names.stream()
    .noneMatch(name -> name.startsWith("Z"));
// noZ: true
```

#### count
Counts the elements in the stream.

```java
long count = names.stream()
    .filter(name -> name.contains("a"))
    .count();
// count: 2 (Jane, Adam)
```

#### min, max
Find the minimum or maximum element according to a comparator.

```java
Optional<String> shortest = names.stream()
    .min(Comparator.comparing(String::length));
// shortest.get(): "Eve"

Optional<String> alphabeticallyFirst = names.stream()
    .min(String::compareTo);
// alphabeticallyFirst.get(): "Adam"
```

#### toArray
Converts the stream to an array.

```java
String[] namesArray = names.stream()
    .toArray(String[]::new);
```

## Optional Class

`Optional<T>` is a container object that may or may not contain a non-null value, helping to avoid `NullPointerException`.

### Creating Optionals

```java
// Empty Optional
Optional<String> empty = Optional.empty();

// From a non-null value
Optional<String> withValue = Optional.of("Hello");

// From a potentially null value
String nullableValue = getValueThatMightBeNull();
Optional<String> withNullable = Optional.ofNullable(nullableValue);
```

### Checking for Values

```java
Optional<String> optional = Optional.ofNullable(getValue());

// Check if a value is present
if (optional.isPresent()) {
    System.out.println("Value: " + optional.get());
}

// Check if empty
if (optional.isEmpty()) { // Java 11+
    System.out.println("No value present");
}
```

### Working with Optional Values

```java
Optional<String> optional = Optional.ofNullable(getValue());

// Execute if present
optional.ifPresent(value -> System.out.println("Value: " + value));

// Get if present, otherwise return default
String result = optional.orElse("Default");

// Get if present, otherwise compute default
String computed = optional.orElseGet(() -> computeDefault());

// Get if present, otherwise throw exception
String value = optional.orElseThrow(() -> new NoSuchElementException("No value"));

// Transform if present
Optional<Integer> length = optional.map(String::length);

// Filter values
Optional<String> filtered = optional.filter(s -> s.length() > 5);

// FlatMap for when the mapping function returns an Optional
Optional<String> upperCase = optional.flatMap(this::toUpperCaseOptional);
```

### Example: Stream with Optional Results

```java
List<Optional<String>> optionals = Arrays.asList(
    Optional.of("Hello"),
    Optional.empty(),
    Optional.of("World")
);

// Filter out empty Optionals and get the values
List<String> filteredValues = optionals.stream()
    .filter(Optional::isPresent)
    .map(Optional::get)
    .collect(Collectors.toList());
// filteredValues: [Hello, World]

// Using flatMap with Optional (Java 9+)
List<String> flatMappedValues = optionals.stream()
    .flatMap(Optional::stream)
    .collect(Collectors.toList());
// flatMappedValues: [Hello, World]
```

## Parallel Streams

Parallel streams distribute work across multiple threads for potential performance improvements.

### Creating Parallel Streams

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Method 1: From a sequential stream
Stream<Integer> parallelStream1 = numbers.stream().parallel();

// Method 2: Directly from a collection
Stream<Integer> parallelStream2 = numbers.parallelStream();
```

### Performance Considerations

```java
// Example: Sum calculation
long start = System.currentTimeMillis();

// Sequential sum
long sequentialSum = LongStream.rangeClosed(1, 100_000_000)
    .sum();

long sequentialTime = System.currentTimeMillis() - start;
System.out.println("Sequential sum: " + sequentialTime + " ms");

// Parallel sum
start = System.currentTimeMillis();
long parallelSum = LongStream.rangeClosed(1, 100_000_000)
    .parallel()
    .sum();

long parallelTime = System.currentTimeMillis() - start;
System.out.println("Parallel sum: " + parallelTime + " ms");
```

### Maintaining Order

```java
// Order is preserved by default, even in parallel streams
List<String> orderedResult = names.parallelStream()
    .sorted()
    .collect(Collectors.toList());

// For operations where order doesn't matter
Set<String> unorderedResult = names.parallelStream()
    .collect(Collectors.toSet());
```

### When to Use Parallel Streams

Good candidates for parallel streams:
- Large datasets
- Computationally intensive operations
- Easily divisible problems
- No shared mutable state

Poor candidates:
- Small datasets
- Operations with dependencies
- I/O-bound operations
- Operations requiring order

```java
// Good: Computationally intensive with large dataset
List<BigInteger> results = LongStream.rangeClosed(1, 10_000)
    .parallel()
    .mapToObj(BigInteger::valueOf)
    .map(n -> n.pow(100000))
    .collect(Collectors.toList());

// Bad: Small dataset with simple operation
List<String> upperCaseNames = names.parallelStream() // Overhead likely exceeds benefit
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

## Best Practices

1. **Prefer method references over lambdas when possible**
   ```java
   // Good
   list.stream().map(String::toUpperCase);
   
   // Less concise
   list.stream().map(s -> s.toUpperCase());
   ```

2. **Use specialized stream types for primitives**
   ```java
   // Better performance
   IntStream.range(1, 100).sum();
   
   // Boxing/unboxing overhead
   Stream.iterate(1, n -> n + 1).limit(99).mapToInt(Integer::intValue).sum();
   ```

3. **Consider the right collector for the job**
   ```java
   // Collecting to the right data structure matters
   Map<Boolean, List<Person>> peopleByGender = people.stream()
       .collect(Collectors.partitioningBy(Person::isMale));
   ```

4. **Avoid side effects in stream operations**
   ```java
   // Bad: Side effects in lambda
   List<String> results = new ArrayList<>();
   stream.forEach(item -> results.add(item.toUpperCase())); // Mutation!
   
   // Good: No side effects
   List<String> results = stream.map(String::toUpperCase)
                               .collect(Collectors.toList());
   ```

5. **Choose streams for functional operations, loops for imperative code**
   ```java
   // Good use of streams for functional transformation
   List<String> upperCaseNames = names.stream()
                                    .map(String::toUpperCase)
                                    .collect(Collectors.toList());
   
   // Better as a for loop if doing imperative operations
   for (String name : names) {
       System.out.println("Processing: " + name);
       // Complex imperative logic...
   }
   ```

6. **Use parallel streams judiciously**
   ```java
   // Only parallelize when it makes sense
   Stream<String> parallelStream = hugeList.parallelStream();
   ```

7. **Limit the use of distinct() on large streams**
   ```java
   // Can be memory-intensive on large streams
   Stream<String> uniqueItems = hugeStream.distinct();
   ```

8. **Break down complex operations**
   ```java
   // Hard to read and debug
   result = people.stream()
       .filter(p -> p.getAge() > 20)
       .map(Person::getName)
       .filter(name -> name.startsWith("A"))
       .map(String::toUpperCase)
       .sorted()
       .collect(Collectors.joining(", "));
   
   // More readable when broken down
   Stream<Person> adultsStream = people.stream()
       .filter(p -> p.getAge() > 20);
   Stream<String> namesStream = adultsStream.map(Person::getName);
   Stream<String> filteredNamesStream = namesStream.filter(name -> name.startsWith("A"));
   Stream<String> processedNamesStream = filteredNamesStream.map(String::toUpperCase)
                                                         .sorted();
   result = processedNamesStream.collect(Collectors.joining(", "));
   ```

9. **Use Optional properly**
   ```java
   // Don't do this
   Optional<String> result = getOptionalString();
   if (result.isPresent()) {
       return result.get();
   } else {
       return "default";
   }
   
   // Do this instead
   return getOptionalString().orElse("default");
   ```

10. **Understand lazy evaluation**
    ```java
    // This doesn't print anything yet (lazy)
    Stream<String> stream = names.stream()
        .filter(name -> {
            System.out.println("Filtering: " + name);
            return name.startsWith("J");
        })
        .map(name -> {
            System.out.println("Mapping: " + name);
            return name.toUpperCase();
        });
    
    // This triggers evaluation
    List<String> result = stream.collect(Collectors.toList());
    ```

## Common Pitfalls

### 1. Reusing Streams
**Problem**: A stream can only be consumed once.

```java
Stream<String> stream = names.stream();
stream.forEach(System.out::println);
// This will fail with IllegalStateException
stream.filter(name -> name.startsWith("J")).forEach(System.out::println);
```

**Solution**: Create a new stream when needed.
```java
names.stream().forEach(System.out::println);
names.stream().filter(name -> name.startsWith("J")).forEach(System.out::println);
```

### 2. Side Effects in Lambdas
**Problem**: Modifying variables from lambda expressions can cause unexpected behavior.

```java
// Avoid this!
List<String> filteredList = new ArrayList<>();
names.stream().filter(name -> {
    if (name.startsWith("J")) {
        filteredList.add(name); // Side effect!
        return false;
    }
    return true;
}).forEach(System.out::println);
```

**Solution**: Use proper stream methods.
```java
List<String> startsWithJ = names.stream()
    .filter(name -> name.startsWith("J"))
    .collect(Collectors.toList());

List<String> doesNotStartWithJ = names.stream()
    .filter(name -> !name.startsWith("J"))
    .collect(Collectors.toList());
```

### 3. Ignoring Return Values of Stream Operations
**Problem**: Stream operations return new streams that must be captured.

```java
// This doesn't modify the original stream
names.stream().filter(name -> name.startsWith("J"));
// No terminal operation, nothing happens
```

**Solution**: Capture the result and use a terminal operation.
```java
List<String> filtered = names.stream()
    .filter(name -> name.startsWith("J"))
    .collect(Collectors.toList());
```

### 4. Misunderstanding Parallel Stream Behavior
**Problem**: Parallel streams don't always improve performance and can cause issues with stateful operations.

```java
// May not be faster, adds thread coordination overhead
List<String> result = smallList.parallelStream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());

// Problematic: stateful operation with shared mutable state
List<String> collected = new ArrayList<>();
names.parallelStream().forEach(collected::add); // Order not guaranteed, potential thread safety issues
```

**Solution**: Use parallel streams only when appropriate and ensure thread safety.
```java
// For stateful operations, use a concurrent collection or proper collector
List<String> collected = names.parallelStream()
    .collect(Collectors.toList()); // Thread-safe collection operation
```

### 5. Incorrect Use of Optional
**Problem**: Using Optional incorrectly negates its benefits.

```java
// Don't do this
Optional<String> opt = findName();
if (opt.isPresent()) {
    String name = opt.get();
    // Use name
} else {
    // Handle empty case
}

// Even worse
String name = findName().get(); // May throw NoSuchElementException
```

**Solution**: Use Optional's methods.
```java
findName().ifPresent(name -> {
    // Use name
});

String name = findName().orElse("Default");

findName().ifPresentOrElse(
    name -> { /* Use name */ },
    () -> { /* Handle empty case */ }
);
```

### 6. Memory Issues with Large Streams
**Problem**: Some operations can consume large amounts of memory.

```java
// This loads all elements into memory for sorting
List<String> sorted = hugeStream.sorted().collect(Collectors.toList());

// This keeps all elements in memory for distinct operation
List<String> unique = hugeStream.distinct().collect(Collectors.toList());
```

**Solution**: Process data in chunks or use appropriate data structures.
```java
// Process in batches
AtomicInteger counter = new AtomicInteger();
List<List<String>> batches = hugeStream
    .collect(Collectors.groupingBy(item -> counter.getAndIncrement() / BATCH_SIZE))
    .values()
    .stream()
    .collect(Collectors.toList());

// For distinct elements, consider using a Set if appropriate
Set<String> uniqueItems = hugeStream.collect(Collectors.toSet());
```

## Resources for Further Learning

1. **Official Documentation**:
   - [Java Stream API Documentation](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html)
   - [Java Lambda Expressions](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)
   - [java.util.function Package](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html)

2. **Books**:
   - "Java 8 in Action" by Raoul-Gabriel Urma, Mario Fusco, and Alan Mycroft
   - "Modern Java in Action" (updated version of the above for Java 9+)
   - "Effective Java" by Joshua Bloch (chapter on lambdas and streams)
   - "Functional Programming in Java" by Venkat Subramaniam

3. **Online Resources**:
   - [Baeldung's Java 8 Streams Tutorial](https://www.baeldung.com/java-8-streams)
   - [Oracle's Lambda Expressions Tutorial](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)
   - [DZone's Java Streams Reference Guide](https://dzone.com/articles/java-streams-api-reference-guide)

4. **Practice Platforms**:
   - [Coding Exercises on Java 8 Streams](https://www.codingame.com/)
   - [Java 8 Stream API Exercises on GitHub](https://github.com/amaembo/java8-stream-api-exercises)

## Practice Exercises

1. **Basic Stream Operations**:
   Transform a list of strings to uppercase, filter those starting with 'A', and collect to a list.

2. **Grouping and Partitioning**:
   Given a list of people with age and gender, group them by age decades and gender.

3. **Numeric Streams**:
   Calculate statistics (min, max, average, sum) for a list of product prices.

4. **Collectors**:
   Use various collectors to transform a list of transactions into meaningful summaries.

5. **Parallel Stream Performance**:
   Compare performance of sequential and parallel streams for CPU-intensive operations.

6. **Composing Lambdas**:
   Create composite functions by combining multiple lambdas.

7. **Optional Handling**:
   Implement a chain of optional operations to safely navigate a complex object graph.

8. **Custom Collectors**:
   Create a custom collector to perform a specific aggregation operation not covered by standard collectors.

9. **Stream Generator**:
   Generate Fibonacci sequence using Stream.iterate.

10. **Real-world Application**:
    Process a large dataset (like CSV file) using streams for filtering, transformation, and aggregation. 